import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Edit2, RefreshCw, Plus, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast'; // Assuming we have toast, or use alert

interface Fundraising {
  id: string;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  jar_link: string;
  jar_id: string;
  card_number: string;
  image_url: string;
  is_active: boolean;
}

const FundraisingList: React.FC = () => {
  const [items, setItems] = useState<Fundraising[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Fundraising | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('fundraisings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching fundraisings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (item: Fundraising) => {
    if (!item.jar_id && !item.jar_link) {
      alert('No Jar ID or Link provided');
      return;
    }

    const jarId = item.jar_id || item.jar_link.split('/').pop();
    
    try {
      const res = await fetch(`/api/jar-status?id=${jarId}`);
      const data = await res.json();
      
      if (data.amount !== undefined) {
        const newAmount = Math.floor(data.amount / 100);
        
        const { error } = await supabase
          .from('fundraisings')
          .update({ current_amount: newAmount })
          .eq('id', item.id);

        if (error) throw error;
        
        // Update local state
        setItems(items.map(i => i.id === item.id ? { ...i, current_amount: newAmount } : i));
        alert(`Updated! New amount: ${newAmount} ₴`);
      } else {
        alert('Failed to fetch data from Monobank');
      }
    } catch (error) {
      console.error(error);
      alert('Sync failed');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    // Extract Jar ID from link if needed
    let jarId = editingItem.jar_id;
    if (!jarId && editingItem.jar_link) {
        jarId = editingItem.jar_link.split('/').pop() || '';
    }

    const dataToSave = { ...editingItem, jar_id: jarId };

    try {
      if (editingItem.id === 'new') {
        const { id, ...rest } = dataToSave;
        const { error } = await supabase.from('fundraisings').insert([rest]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('fundraisings')
          .update(dataToSave)
          .eq('id', editingItem.id);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      console.error(error);
      alert('Error saving');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    
    try {
      const { error } = await supabase.from('fundraisings').delete().eq('id', id);
      if (error) throw error;
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      alert('Error deleting');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-800">Fundraisings</h1>
        <Button onClick={() => {
          setEditingItem({
            id: 'new',
            title: '',
            description: '',
            target_amount: 0,
            current_amount: 0,
            jar_link: '',
            jar_id: '',
            card_number: '',
            image_url: '',
            is_active: true
          });
          setIsModalOpen(true);
        }}>
          <Plus size={20} className="mr-2" />
          Add New
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-neutral-600">Title</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-neutral-600">Progress</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-neutral-600">Active</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-neutral-800">{item.title}</div>
                  <div className="text-sm text-neutral-500 truncate max-w-xs">{item.description}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">
                      {item.current_amount.toLocaleString()} / {item.target_amount.toLocaleString()} ₴
                    </span>
                    <button 
                      onClick={() => handleSync(item)}
                      className="p-1.5 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Sync with Monobank"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                  <div className="w-24 h-1.5 bg-neutral-100 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${Math.min((item.current_amount / item.target_amount) * 100, 100)}%` }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    item.is_active ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => {
                        setEditingItem(item);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingItem.id === 'new' ? 'New Fundraising' : 'Edit Fundraising'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-neutral-100 rounded-lg">
                <ExternalLink size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Title</label>
                  <input 
                    type="text" 
                    required
                    value={editingItem.title}
                    onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Image URL</label>
                  <input 
                    type="text" 
                    value={editingItem.image_url}
                    onChange={e => setEditingItem({ ...editingItem, image_url: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Description</label>
                <textarea 
                  rows={3}
                  value={editingItem.description}
                  onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full p-2 border border-neutral-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Target Amount (UAH)</label>
                  <input 
                    type="number" 
                    required
                    value={editingItem.target_amount}
                    onChange={e => setEditingItem({ ...editingItem, target_amount: Number(e.target.value) })}
                    className="w-full p-2 border border-neutral-300 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Current Amount (UAH)</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      required
                      value={editingItem.current_amount}
                      onChange={e => setEditingItem({ ...editingItem, current_amount: Number(e.target.value) })}
                      className="w-full p-2 border border-neutral-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Jar Link</label>
                  <input 
                    type="text" 
                    value={editingItem.jar_link}
                    onChange={e => setEditingItem({ ...editingItem, jar_link: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded-lg"
                    placeholder="https://send.monobank.ua/jar/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Card Number</label>
                  <input 
                    type="text" 
                    value={editingItem.card_number}
                    onChange={e => setEditingItem({ ...editingItem, card_number: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="isActive"
                  checked={editingItem.is_active}
                  onChange={e => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-neutral-700">Active (Show on site)</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundraisingList;
