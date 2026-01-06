import React from 'react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('footer.privacy')} | Meowroom</title>
      </Helmet>

      <div className="pt-24 min-h-screen bg-white pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-8">{t('footer.privacy')}</h1>
          
          <div className="prose prose-lg text-neutral-600 space-y-6">
            <p>
              Ми в Meowroom поважаємо вашу конфіденційність і прагнемо захищати ваші персональні дані. Ця Політика конфіденційності пояснює, як ми збираємо, використовуємо та захищаємо інформацію, яку ви надаєте нам під час використання нашого веб-сайту та послуг.
            </p>

            <h2 className="text-xl font-bold text-neutral-800">1. Збір інформації</h2>
            <p>
              Ми можемо збирати наступну інформацію, коли ви користуєтесь нашим сайтом, бронюєте візит або зв'язуєтесь з нами:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Ім'я та прізвище</li>
              <li>Контактний номер телефону</li>
              <li>Адреса електронної пошти</li>
              <li>Інформація про бронювання (дата, час, кількість гостей)</li>
            </ul>

            <h2 className="text-xl font-bold text-neutral-800">2. Використання інформації</h2>
            <p>
              Зібрана інформація використовується для:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Обробки та підтвердження ваших бронювань</li>
              <li>Зв'язку з вами щодо вашого візиту або змін у розкладі</li>
              <li>Надсилання важливих повідомлень та оновлень (за вашою згодою)</li>
              <li>Покращення якості наших послуг та роботи веб-сайту</li>
            </ul>

            <h2 className="text-xl font-bold text-neutral-800">3. Захист даних</h2>
            <p>
              Ми вживаємо всіх необхідних заходів для захисту ваших персональних даних від несанкціонованого доступу, зміни, розголошення або знищення. Ваші дані зберігаються на захищених серверах і доступ до них мають лише уповноважені співробітники.
            </p>

            <h2 className="text-xl font-bold text-neutral-800">4. Передача даних третім особам</h2>
            <p>
              Ми не продаємо, не обмінюємо та не передаємо ваші персональні дані стороннім компаніям, за винятком випадків, коли це необхідно для надання послуг (наприклад, обробка платежів через платіжні системи) або коли цього вимагає закон.
            </p>

            <h2 className="text-xl font-bold text-neutral-800">5. Файли Cookie</h2>
            <p>
              Наш сайт може використовувати файли cookie для покращення взаємодії з користувачем. Ви можете налаштувати свій браузер так, щоб відмовлятися від усіх файлів cookie або вказувати, коли файл cookie надсилається.
            </p>

            <h2 className="text-xl font-bold text-neutral-800">6. Зміни до політики конфіденційності</h2>
            <p>
              Ми можемо час від часу оновлювати цю Політику конфіденційності. Ми рекомендуємо періодично переглядати цю сторінку, щоб бути в курсі будь-яких змін.
            </p>

            <h2 className="text-xl font-bold text-neutral-800">7. Контакти</h2>
            <p>
              Якщо у вас виникли запитання щодо цієї Політики конфіденційності, будь ласка, зв'яжіться з нами за адресою: <a href="mailto:meowroom.kharkiv@gmail.com" className="text-primary-600 hover:underline">meowroom.kharkiv@gmail.com</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
