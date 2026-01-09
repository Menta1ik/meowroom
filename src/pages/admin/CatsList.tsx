import React, { useRef, useState } from 'react';
import { useCats } from '../../hooks/useCats';
import { Button } from '../../components/ui/Button';
import { Plus, Edit, Trash2, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';
import { read, utils, writeFile } from 'xlsx';
import { 
  AdminTable, 
  AdminTableHead, 
  AdminTableHeader, 
  AdminTableBody, 
  AdminTableRow, 
  AdminTableCell 
} from '../../components/ui/AdminTable';

export const CatsList: React.FC = () => {
  const { cats, loading, error } = useCats();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleDownloadTemplate = () => {
    const ws = utils.json_to_sheet([
      {
        name: "Murzik",
        gender: "boy",
        age: "2 years",
        history: "Very cute cat...",
        tags: "playful;vaccinated"
      }
    ]);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Cats");
    writeFile(wb, "meowroom_cats_template.xlsx");
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet) as any[];

      const catsToInsert = jsonData.map(row => ({
        name: row.name,
        gender: row.gender?.toLowerCase() || 'boy',
        age: row.age ? String(row.age) : '',
        history: row.history || '',
        status: 'available',
        tags: row.tags ? row.tags.split(';').map((t: string) => t.trim()) : [],
        images: [] 
      })).filter(cat => cat.name); 

      if (catsToInsert.length === 0) {
        alert(t('admin.cats.import_error')); 
        setIsImporting(false);
        return;
      }

      const { error } = await supabase.from('cats').insert(catsToInsert);

      if (error) throw error;

      alert(t('admin.cats.import_success', { count: catsToInsert.length }));
      window.location.reload();
    } catch (error) {
      console.error('Import error:', error);
      alert(t('admin.cats.import_error'));
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.common.confirm_delete'))) return;
    
    try {
      const { error } = await supabase.from('cats').delete().eq('id', id);
      if (error) throw error;
      window.location.reload();
    } catch (err) {
      console.error('Error deleting cat:', err);
      alert(t('admin.common.delete_error'));
    }
  };

  if (loading) return <div className="p-8 text-center">{t('admin.common.loading')}</div>;
  if (error) return <div className="p-8 text-center text-red-500">{t('admin.common.error')}: {error}</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      <div className="p-6 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-neutral-800">{t('admin.cats.title')}</h2>
        <div className="flex flex-wrap gap-2 justify-center md:justify-end">
           <Button variant="outline" onClick={handleDownloadTemplate} title={t('admin.cats.download_template')}>
             <Download size={18} />
             <span className="ml-2 hidden sm:inline">{t('admin.cats.download_template')}</span>
           </Button>
           <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isImporting}>
             <Upload size={18} className="mr-2" />
             {isImporting ? t('admin.cats.importing') : t('admin.cats.import_excel')}
           </Button>
           <Button onClick={() => navigate('/admin/cats/new')} className="flex items-center gap-2">
             <Plus size={18} />
             {t('admin.cats.add_new')}
           </Button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImport} 
          className="hidden" 
          accept=".xlsx, .xls"
        />
      </div>
      
      <AdminTable>
        <AdminTableHead>
          <AdminTableHeader>{t('admin.cats.table.image')}</AdminTableHeader>
          <AdminTableHeader>{t('admin.cats.table.name')}</AdminTableHeader>
          <AdminTableHeader>{t('admin.cats.table.age')}</AdminTableHeader>
          <AdminTableHeader>{t('admin.cats.table.gender')}</AdminTableHeader>
          <AdminTableHeader>{t('admin.cats.table.actions')}</AdminTableHeader>
        </AdminTableHead>
        <AdminTableBody>
          {cats.map((cat) => (
            <AdminTableRow key={cat.id}>
              <AdminTableCell>
                <img
                  src={cat.images?.[0] || 'https://placehold.co/40x40/e2e8f0/a0aec0?text=Cat'}
                  alt={cat.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </AdminTableCell>
              <AdminTableCell>
                <div className="font-medium text-neutral-800">{cat.name}</div>
              </AdminTableCell>
              <AdminTableCell>
                <div className="text-neutral-600">{cat.age}</div>
              </AdminTableCell>
              <AdminTableCell>
                <div className="text-neutral-600">
                  {cat.gender === 'boy' || cat.gender === 'Мальчик' ? t('admin.cats.gender.boy') : 
                   cat.gender === 'girl' || cat.gender === 'Девочка' ? t('admin.cats.gender.girl') : cat.gender}
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/admin/cats/${cat.id}`)}
                    className="p-2 hover:bg-primary-50 text-primary-600 rounded-full transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
          {cats.length === 0 && (
            <AdminTableRow>
              <AdminTableCell className="text-center text-neutral-500" />
              <AdminTableCell />
                No cats found. Add one to get started!
              <AdminTableCell />
              <AdminTableCell />
            </AdminTableRow>
          )}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
};
