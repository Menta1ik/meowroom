import React from 'react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { Helmet } from 'react-helmet-async';

const TermsOfUse: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('footer.terms')} | Meowroom</title>
      </Helmet>

      <div className="pt-24 min-h-screen bg-white pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-8">{t('footer.terms')}</h1>
          
          <div className="prose prose-lg text-neutral-600 space-y-6">
            <p>
              Ласкаво просимо до Meowroom! Використовуючи наш веб-сайт та відвідуючи наш заклад, ви погоджуєтесь дотримуватися наступних Умов використання. Будь ласка, уважно прочитайте їх перед використанням наших послуг.
            </p>

            <h2 className="text-xl font-bold text-neutral-800">1. Загальні положення</h2>
            <p>
              Meowroom — це простір, що поєднує формат антикафе та притулку для котів. Наша головна мета — забезпечення комфорту та безпеки як для наших відвідувачів, так і для тварин.
            </p>

            <h2 className="text-xl font-bold text-neutral-800">2. Правила поведінки</h2>
            <p>
              Відвідувачі зобов'язані дотримуватися правил поведінки в закладі, які включають, але не обмежуються:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Дбайливе ставлення до тварин. Заборонено кривдити, лякати або насильно утримувати котів.</li>
              <li>Дотримання чистоти та гігієни.</li>
              <li>Повага до інших відвідувачів та персоналу.</li>
              <li>Виконання вказівок адміністратора.</li>
            </ul>
            <p>
              Детальний список правил відвідування доступний на сторінці <a href="/visit" className="text-primary-600 hover:underline">Візит</a>.
            </p>

            <h2 className="text-xl font-bold text-neutral-800">3. Бронювання та оплата</h2>
            <p>
              Послуги антикафе надаються на платній основі. Оплата здійснюється за час перебування згідно з діючими тарифами. Бронювання візиту можна здійснити через наш веб-сайт. Ми залишаємо за собою право відмовити в обслуговуванні особам, які порушують правила закладу.
            </p>

            <h2 className="text-xl font-bold text-neutral-800">4. Відповідальність</h2>
            <p>
              Адміністрація не несе відповідальності за особисті речі відвідувачів, залишені без нагляду. Відвідувачі несуть матеріальну відповідальність за пошкодження майна закладу. Батьки несуть повну відповідальність за поведінку та безпеку своїх дітей.
            </p>

            <h2 className="text-xl font-bold text-neutral-800">5. Інтелектуальна власність</h2>
            <p>
              Весь контент на цьому веб-сайті, включаючи тексти, зображення, логотипи, є власністю Meowroom або використовується з дозволу власників і захищений законами про авторське право.
            </p>

            <h2 className="text-xl font-bold text-neutral-800">6. Зміни до умов</h2>
            <p>
              Ми залишаємо за собою право вносити зміни до цих Умов використання в будь-який час. Зміни набирають чинності з моменту їх публікації на веб-сайті.
            </p>

            <h2 className="text-xl font-bold text-neutral-800">7. Контакти</h2>
            <p>
              Якщо у вас є запитання або пропозиції, будь ласка, зв'яжіться з нами: <a href="mailto:meowroom.kharkiv@gmail.com" className="text-primary-600 hover:underline">meowroom.kharkiv@gmail.com</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfUse;
