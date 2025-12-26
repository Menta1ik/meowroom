import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, Copy, Check, Building, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';

interface RequisiteItemProps {
  icon: string;
  title: string;
  fields: { label: string; value: string; isCopyable?: boolean; fullWidth?: boolean }[];
  details?: string;
}

const RequisiteItem: React.FC<RequisiteItemProps> = ({ icon, title, fields, details }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [copiedValue, setCopiedValue] = React.useState<string | null>(null);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-primary-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h4 className="font-bold text-neutral-800">{title}</h4>
        </div>
        {isOpen ? <ChevronUp className="text-neutral-400" /> : <ChevronDown className="text-neutral-400" />}
      </button>
      
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-5 pt-0 border-t border-neutral-100 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm pt-4">
            {fields.map((field, idx) => (
              <div key={idx} className={field.fullWidth ? 'md:col-span-2' : ''}>
                <span className="text-neutral-500 block mb-1">{field.label}:</span>
                <div className="flex items-center gap-2">
                  <span className={`font-medium text-neutral-800 ${field.isCopyable ? 'font-mono bg-neutral-50 px-2 py-1 rounded' : ''}`}>
                    {field.value}
                  </span>
                  {field.isCopyable && (
                    <button
                      onClick={() => handleCopy(field.value)}
                      className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-primary-500 transition-colors"
                      title="Копировать"
                    >
                      {copiedValue === field.value ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {details && (
              <div className="md:col-span-2 mt-2 pt-4 border-t border-neutral-100">
                <span className="text-neutral-500 block mb-2">Bank details:</span>
                <p className="text-neutral-800 text-xs leading-relaxed whitespace-pre-line font-mono bg-neutral-50 p-3 rounded-lg">
                  {details}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const DonationBlock: React.FC = () => {

  const [isRequisitesOpen, setIsRequisitesOpen] = React.useState(false);

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-primary-600 p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-2">Помощь приюту</h2>
        <p className="text-primary-100">Ваша поддержка обеспечивает тепло, уют и заботу для каждого нашего подопечного</p>
      </div>
      
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 border border-neutral-200 rounded-2xl hover:border-primary-500 transition-colors cursor-pointer group flex flex-col">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm bg-neutral-100 flex-shrink-0">
                <img src="/monobank-logo.png" alt="Monobank" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight mb-1">Monobank</h3>
                <p className="text-sm text-neutral-500 leading-tight">Банка без комиссии</p>
              </div>
            </div>
            <Button 
              href="https://send.monobank.ua/jar/8DiRFSvJLX" 
              target="_blank"
              className="w-full group-hover:bg-primary-50 mt-auto"
              variant="outline"
            >
              Пополнить
            </Button>
          </div>

          <div className="p-6 border border-neutral-200 rounded-2xl hover:border-primary-500 transition-colors cursor-pointer group flex flex-col">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 border border-neutral-100 p-2">
                <img src="/paypal-logo.png" alt="PayPal" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight mb-1">PayPal</h3>
                <p className="text-sm text-neutral-500 leading-tight">Международный перевод</p>
              </div>
            </div>
            <Button 
              href="https://www.paypal.com/donate/?hosted_button_id=YPUCKDKSF7EP6" 
              target="_blank"
              className="w-full group-hover:bg-primary-50 mt-auto"
              variant="outline"
            >
              Перевести
            </Button>
          </div>

          <div className="p-6 border border-neutral-200 rounded-2xl hover:border-primary-500 transition-colors cursor-pointer group flex flex-col">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 border border-neutral-100 p-2">
                <img src="/privatbank-logo.png" alt="PrivatBank" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight mb-1">PrivatBank</h3>
                <p className="text-sm text-neutral-500 leading-tight">Конверт</p>
              </div>
            </div>
            <Button 
              href="https://next.privat24.ua/send/blm72" 
              target="_blank"
              className="w-full group-hover:bg-primary-50 mt-auto"
              variant="outline"
            >
              Пополнить
            </Button>
          </div>
        </div>

        {/* Official Requisites */}
        <div className="bg-neutral-50 rounded-2xl overflow-hidden">
          <button 
            onClick={() => setIsRequisitesOpen(!isRequisitesOpen)}
            className="w-full flex items-center justify-between p-6 transition-colors"
          >
            <h3 className="text-xl font-bold text-primary-800 flex items-center gap-2">
              <Building className="text-primary-600" size={24} />
              Реквизиты фонда
            </h3>
            {isRequisitesOpen ? <ChevronUp className="text-neutral-500" /> : <ChevronDown className="text-neutral-500" />}
          </button>
          
          <motion.div 
            initial={false}
            animate={{ height: isRequisitesOpen ? 'auto' : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 space-y-4">
              <RequisiteItem 
                icon="💷"
                title="UAH Account"
                fields={[
                  { label: "Legal entity", value: "CF BLUECROSSFORCATS CO", isCopyable: true, fullWidth: true },
                  { label: "Enterprise code", value: "44720631", isCopyable: true },
                  { label: "Account number", value: "UA713510050000026006879160130", isCopyable: true, fullWidth: true },
                  { label: "Bank name", value: "JOINT STOCK COMPANY \"UKRSIBBANK\"", isCopyable: true, fullWidth: true }
                ]}
              />

              <RequisiteItem 
                icon="💶"
                title="EUR Account"
                fields={[
                  { label: "Legal entity", value: "CF BLUECROSSFORCATS CO", isCopyable: true, fullWidth: true },
                  { label: "Enterprise code", value: "44720631", isCopyable: true },
                  { label: "Account number", value: "UA103510050000026004879160132", isCopyable: true, fullWidth: true }
                ]}
                details={`JOINT STOCK COMPANY "UKRSIBBANK"
Beneficiary bank: 07205696, UKRSIBBANK, ANDRIIVSKA STREET 2/12, KYIV, UKRAINE
SWIFT code: KHABUA2K
Intermediary bank: BNP PARIBAS SA, Paris, FRANCE, SWIFT: BNPAFRPP`}
              />

              <RequisiteItem 
                icon="💵"
                title="USD Account"
                fields={[
                  { label: "Legal entity", value: "CF BLUECROSSFORCATS CO", isCopyable: true, fullWidth: true },
                  { label: "Enterprise code", value: "44720631", isCopyable: true },
                  { label: "Account number", value: "UA893510050000026005879160131", isCopyable: true, fullWidth: true }
                ]}
                details={`JOINT STOCK COMPANY "UKRSIBBANK"
Beneficiary bank: 020061151200138, UKRSIBBANK, ANDRIIVSKA STREET 2/12, KYIV, UKRAINE
SWIFT code: KHABUA2K
Intermediary bank: BNP PARIBAS U.S.A. New York Branch, New York , USA, SWIFT: BNPAUS3N`}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
