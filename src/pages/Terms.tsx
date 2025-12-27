import { useLanguage, Language } from '@/contexts/LanguageContext';

interface TermsSection {
  heading: string;
  paragraphs: string[];
}

interface TermsContent {
  title: string;
  intro: string;
  sections: TermsSection[];
}

const termsContent: Record<Language, TermsContent> = {
  az: {
    title: 'Şərtlər və Qaydalar',
    intro: 'Car Rent Baku xidmətlərindən istifadə etməklə aşağıdakı bütün şərtləri qəbul etmiş olursunuz.',
    sections: [
      {
        heading: '1. Ümumi Məlumat',
        paragraphs: [
          'Bu vebsayt Car Rent Baku şirkətinə məxsusdur və onun idarəçiliyi altındadır.',
          'Saytımızdan və xidmətlərimizdən istifadə etməklə, aşağıda qeyd olunan bütün şərtləri və qaydaları qəbul etmiş olursunuz.'
        ]
      },
      {
        heading: '2. İcarə Şərtləri',
        paragraphs: [
          'Avtomobil yalnız 23 yaşdan yuxarı və minimum 2 illik sürücülük təcrübəsi olan şəxslərə və ən az 2 günlük icarəyə verilir.',
          'İcarəçi avtomobili yalnız Azərbaycan qanunlarına riayət edərək və təhlükəsiz şəkildə idarə etməlidir.',
          'Avtomobilin üçüncü şəxsə verilməsi qəti qadağandır.',
          'İcarə müddəti ərzində avtomobilin təhlükəsiz və qaydalara uyğun istifadəsinə icarəçi tam cavabdehdir.'
        ]
      },
      {
        heading: '3. Rezervasiya və Ödəniş',
        paragraphs: [
          'Rezervasiya sayt, WhatsApp və ya ofisimizə gələrək həyata keçirilə bilər.',
          'Rezervasiyanın təsdiqi üçün ilkin ödəniş tələb olunmur.',
          'Ödənişlər nağd, bank kartı və ya bank köçürməsi ilə qəbul edilir.',
          'Qiymətlər gün, həftə və ya ay üzrə hesablanır və saytda göstərilən məbləğlərdə bütün vergilər nəzərə alınır.'
        ]
      },
      {
        heading: '4. Cavabdehlik və Zərərlər',
        paragraphs: [
          'Car Rent Baku şirkətinin avtomobilləri tam sığortalıdır (icbari və kasko).',
          'İcarəçi avtomobilə qəsdən və ya səhlənkarlıq nəticəsində dəyən hər hansı zərərə görə məsuliyyət daşıyır.',
          'Avtomobilin istifadəsi zamanı yaranan cərimələr və ya qayda pozuntuları icarəçinin məsuliyyətindədir.'
        ]
      },
      {
        heading: '5. Yanacaq və Təmizlik Qaydaları',
        paragraphs: [
          'Avtomobil təhvil alındığı yanacaq səviyyəsində qaytarılmalıdır.',
          'Əgər yanacaq səviyyəsi az olarsa, fərq icarəçi tərəfindən ödənilir.',
          'Avtomobilin daxili və xarici hissəsində ciddi çirklənmə olarsa, təmizlik haqqı tətbiq oluna bilər.'
        ]
      },
      {
        heading: '6. Cərimələr və Yol Qaydaları',
        paragraphs: [
          'İcarə müddətində yaranan bütün yol hərəkəti qaydası pozuntuları, radar cərimələri və parkinq ödənişləri icarəçinin məsuliyyətindədir.',
          'Şirkət dövlət orqanlarından cərimə barədə məlumat aldıqda, məbləğ icarəçidən tutulacaq və ya xəbərdarlıq ediləcək.'
        ]
      },
      {
        heading: '7. Avtomobilin Qaytarılması',
        paragraphs: [
          'Avtomobil müəyyən olunmuş tarix və saatda qaytarılmalıdır.',
          'Avtomobilin gec qaytarılması halında əlavə ödəniş tətbiq olunur.',
          'Əgər avtomobil təyin olunmuş vaxtdan 3 saatdan artıq gec qaytarılarsa, əlavə 1 günlük icarə haqqı hesablanır.'
        ]
      },
      {
        heading: '8. Məsuliyyətin Məhdudlaşdırılması',
        paragraphs: [
          'Car Rent Baku şirkəti sürücünün səhvi ucbatından yaranan texniki nasazlıqlara, qəza hallarına və ya üçüncü tərəflərin hərəkətləri nəticəsində yaranan dolayı zərərlərə görə məsuliyyət daşımır.',
          'Şirkət xidmətlərini xəbərdarlıq etmədən dəyişdirmək və ya dayandırmaq hüququna malikdir.'
        ]
      },
      {
        heading: '9. Şəxsi Məlumatların Qorunması',
        paragraphs: [
          'İcarə prosesi zamanı təqdim olunan şəxsi məlumatlar yalnız müqavilənin icrası və əlaqə məqsədi ilə istifadə olunur.',
          'Bütün məlumatlar Gizlilik Siyasətinə uyğun olaraq qorunur və üçüncü tərəflərlə paylaşılmır.'
        ]
      },
      {
        heading: '10. Hüquqi Məsələlər',
        paragraphs: [
          'Bu şərtlər Azərbaycan Respublikasının qanunvericiliyinə əsasən tənzimlənir.',
          'Mübahisələr yarandıqda tərəflər ilkin olaraq razılaşma yolu ilə həll etməyə çalışacaq, mümkün olmadıqda isə məsələ Bakı şəhəri məhkəmələrində baxılacaq.'
        ]
      }
    ]
  },
  ru: {
    title: 'Условия и положения',
    intro: 'Пользуясь сайтом Car Rent Baku, вы принимаете следующие условия аренды.',
    sections: [
      {
        heading: '1. Общая информация',
        paragraphs: [
          'Данный веб-сайт принадлежит и управляется компанией Car Rent Baku.',
          'Пользуясь нашим сайтом и услугами, вы соглашаетесь с приведёнными ниже условиями и положениями.'
        ]
      },
      {
        heading: '2. Условия аренды',
        paragraphs: [
          'Автомобиль предоставляется в аренду только лицам старше 23 лет, имеющим не менее 2 лет водительского стажа.',
          'Минимальный срок аренды составляет 2 дня.',
          'Арендатор обязан управлять автомобилем безопасно и строго в соответствии с законодательством Азербайджанской Республики.',
          'Передача автомобиля третьим лицам строго запрещена.',
          'Арендатор несёт полную ответственность за безопасное и надлежащее использование автомобиля в течение всего срока аренды.'
        ]
      },
      {
        heading: '3. Бронирование и оплата',
        paragraphs: [
          'Бронирование может быть осуществлено через сайт, WhatsApp или лично в нашем офисе.',
          'Для подтверждения бронирования предоплата не требуется.',
          'Оплата принимается наличными, банковской картой или безналичным переводом.',
          'Стоимость аренды рассчитывается по суткам, неделям или месяцам. Все цены, указанные на сайте, включают налоги.'
        ]
      },
      {
        heading: '4. Ответственность и ущерб',
        paragraphs: [
          'Все автомобили компании Car Rent Baku полностью застрахованы (обязательная и каско-страховка).',
          'Арендатор несёт ответственность за любой ущерб, нанесённый автомобилю умышленно или по неосторожности.',
          'Все штрафы, нарушения правил дорожного движения и административные взыскания, возникшие в период аренды, оплачиваются арендатором.'
        ]
      },
      {
        heading: '5. Правила топлива и чистоты',
        paragraphs: [
          'Автомобиль должен быть возвращён с тем же уровнем топлива, с которым был получен.',
          'Если уровень топлива ниже, арендатор оплачивает разницу.',
          'При сильном загрязнении салона или кузова автомобиля может взиматься дополнительная плата за мойку.'
        ]
      },
      {
        heading: '6. Штрафы и правила дорожного движения',
        paragraphs: [
          'Все нарушения ПДД, штрафы за превышение скорости и парковочные платежи, возникшие во время аренды, несёт арендатор.',
          'Если компания получает уведомление о штрафе от государственных органов, соответствующая сумма будет удержана с арендатора или ему будет направлено уведомление.'
        ]
      },
      {
        heading: '7. Возврат автомобиля',
        paragraphs: [
          'Автомобиль должен быть возвращён в согласованные дату и время.',
          'В случае опоздания взимается дополнительная плата.',
          'Если автомобиль возвращается более чем на 3 часа позже, взимается дополнительная суточная арендная плата.'
        ]
      },
      {
        heading: '8. Ограничение ответственности',
        paragraphs: [
          'Компания Car Rent Baku не несёт ответственности за косвенные убытки, технические неисправности, ДТП или действия третьих лиц.',
          'Компания оставляет за собой право изменять или приостанавливать предоставление услуг без предварительного уведомления.'
        ]
      },
      {
        heading: '9. Защита персональных данных',
        paragraphs: [
          'Личные данные используются исключительно для заключения договора и связи с клиентом.',
          'Вся информация защищена в соответствии с Политикой конфиденциальности и не передаётся третьим лицам.'
        ]
      },
      {
        heading: '10. Правовые вопросы',
        paragraphs: [
          'Настоящие условия регулируются законодательством Азербайджанской Республики.',
          'В случае споров стороны обязуются первоначально урегулировать их мирным путём, при невозможности спор рассматривается в судах города Баку.'
        ]
      }
    ]
  },
  en: {
    title: 'Terms and Conditions',
    intro: 'By accessing Car Rent Baku services you agree to the following rental terms.',
    sections: [
      {
        heading: '1. General Information',
        paragraphs: [
          'This website is owned and operated by Car Rent Baku.',
          'By accessing our website and using our services, you agree to comply with all the terms and conditions stated below.'
        ]
      },
      {
        heading: '2. Rental Conditions',
        paragraphs: [
          'Vehicles are rented only to drivers over 23 years of age with at least 2 years of driving experience.',
          'The minimum rental period is 2 days.',
          'The renter must operate the vehicle safely and in full compliance with the laws of the Republic of Azerbaijan.',
          'Subleasing or allowing a third party to drive the vehicle is strictly prohibited.',
          'The renter is fully responsible for the safe and proper use of the vehicle during the rental period.'
        ]
      },
      {
        heading: '3. Reservation and Payment',
        paragraphs: [
          'Reservations can be made via our website, WhatsApp, or in person at our office.',
          'No advance payment is required to confirm a reservation.',
          'Payments can be made in cash, by credit/debit card, or via bank transfer.',
          'Rental rates are calculated per day, week, or month, and all prices displayed on the website include applicable taxes.'
        ]
      },
      {
        heading: '4. Liability and Damages',
        paragraphs: [
          'All vehicles provided by Car Rent Baku are fully insured (both compulsory and comprehensive insurance).',
          'The renter is responsible for any damage to the vehicle caused by negligence or intentional misconduct.',
          'Any traffic fines, penalties, or violations incurred during the rental period are the responsibility of the renter.'
        ]
      },
      {
        heading: '5. Fuel and Cleaning Policy',
        paragraphs: [
          'The vehicle must be returned with the same fuel level as at the start of the rental.',
          'If the fuel level is lower upon return, the difference must be paid by the renter.',
          'A cleaning fee may apply if the vehicle is returned excessively dirty inside or outside.'
        ]
      },
      {
        heading: '6. Fines and Traffic Regulations',
        paragraphs: [
          'All traffic violations, speeding fines, and parking fees incurred during the rental period are the responsibility of the renter.',
          'If Car Rent Baku receives official notification of a fine from authorities, the renter will be informed and the corresponding amount will be charged.'
        ]
      },
      {
        heading: '7. Vehicle Return',
        paragraphs: [
          'The vehicle must be returned on the agreed date and time.',
          'Late returns are subject to additional charges.',
          'If the vehicle is returned more than 3 hours late, an extra day’s rental fee will be applied.'
        ]
      },
      {
        heading: '8. Limitation of Liability',
        paragraphs: [
          'Car Rent Baku shall not be held liable for indirect damages, technical failures, or accidents resulting from driver error or actions of third parties.',
          'The company reserves the right to modify or discontinue its services at any time without prior notice.'
        ]
      },
      {
        heading: '9. Protection of Personal Data',
        paragraphs: [
          'Personal information provided during the rental process is used solely for contractual and communication purposes.',
          'All data is protected in accordance with our Privacy Policy and will not be shared with third parties without consent.'
        ]
      },
      {
        heading: '10. Legal Matters',
        paragraphs: [
          'These terms and conditions are governed by the laws of the Republic of Azerbaijan.',
          'In the event of a dispute, both parties shall first attempt an amicable settlement. If no agreement is reached, the matter will be resolved in the courts of Baku, Azerbaijan.'
        ]
      }
    ]
  },
  ar: {
    title: 'الشروط والأحكام',
    intro: 'باستخدامك موقع Car Rent Baku وخدماته فأنت توافق على جميع الشروط الموجودة أدناه.',
    sections: [
      {
        heading: '1. المعلومات العامة',
        paragraphs: [
          'يعود هذا الموقع الإلكتروني إلى شركة Car Rent Baku ويُدار من قبلها.',
          'باستخدامك لموقعنا الإلكتروني وخدماتنا، فإنك توافق على جميع الشروط والأحكام الموضحة أدناه.'
        ]
      },
      {
        heading: '2. شروط التأجير',
        paragraphs: [
          'يتم تأجير السيارات فقط للأشخاص الذين تجاوزت أعمارهم 23 عامًا ولديهم خبرة قيادة لا تقل عن سنتين.',
          'الحد الأدنى لفترة التأجير هو يومان (48 ساعة).',
          'يجب على المستأجر قيادة السيارة بأمان وبما يتوافق مع قوانين جمهورية أذربيجان.',
          'يُمنع منعًا باتًا تأجير السيارة لطرف ثالث أو السماح لأي شخص آخر بقيادتها.',
          'يتحمل المستأجر المسؤولية الكاملة عن الاستخدام الآمن والسليم للمركبة خلال فترة التأجير.'
        ]
      },
      {
        heading: '3. الحجز والدفع',
        paragraphs: [
          'يمكن إجراء الحجز عبر الموقع الإلكتروني أو واتساب أو بشكل مباشر في مكتبنا.',
          'لا يُطلب دفع مسبق لتأكيد الحجز.',
          'يمكن الدفع نقدًا أو باستخدام بطاقة مصرفية أو عن طريق التحويل البنكي.',
          'تُحسب الأسعار يوميًا أو أسبوعيًا أو شهريًا، وتشمل جميع الضرائب المعلنة على الموقع.'
        ]
      },
      {
        heading: '4. المسؤولية والأضرار',
        paragraphs: [
          'جميع سيارات شركة Car Rent Baku مؤمَّنة بالكامل (تأمين إلزامي وتأمين شامل).',
          'يتحمل المستأجر المسؤولية عن أي ضرر ناتج عن الإهمال أو الاستخدام غير السليم للمركبة.',
          'جميع المخالفات المرورية والغرامات خلال فترة التأجير تقع على عاتق المستأجر.'
        ]
      },
      {
        heading: '5. الوقود والنظافة',
        paragraphs: [
          'يجب إعادة السيارة بنفس مستوى الوقود الذي تم استلامها به.',
          'في حال كانت كمية الوقود أقل، يتعين على المستأجر دفع الفرق.',
          'في حال تم إرجاع السيارة وهي متسخة بشكل مفرط داخليًا أو خارجيًا، قد يتم فرض رسوم تنظيف إضافية.'
        ]
      },
      {
        heading: '6. الغرامات وقواعد المرور',
        paragraphs: [
          'يتحمل المستأجر كامل المسؤولية عن جميع المخالفات المرورية، وغرامات السرعة، ورسوم مواقف السيارات التي تقع خلال فترة التأجير.',
          'إذا تلقت شركة Car Rent Baku إشعارًا رسميًا بغرامة من الجهات الحكومية، فسيتم خصم المبلغ من المستأجر أو إبلاغه بذلك.'
        ]
      },
      {
        heading: '7. إعادة السيارة',
        paragraphs: [
          'يجب إعادة السيارة في الوقت والتاريخ المتفق عليهما.',
          'في حال التأخير في الإرجاع، سيتم فرض رسوم إضافية.',
          'إذا تم إرجاع السيارة بعد أكثر من 3 ساعات من الموعد المحدد، يتم احتساب رسوم إيجار يوم إضافي.'
        ]
      },
      {
        heading: '8. حدود المسؤولية',
        paragraphs: [
          'لا تتحمل شركة Car Rent Baku أي مسؤولية عن الأضرار غير المباشرة أو الأعطال الفنية أو الحوادث الناتجة عن خطأ السائق أو تصرفات أطراف ثالثة.',
          'تحتفظ الشركة بالحق في تعديل أو إيقاف خدماتها في أي وقت دون إشعار مسبق.'
        ]
      },
      {
        heading: '9. حماية البيانات الشخصية',
        paragraphs: [
          'تُستخدم المعلومات الشخصية المقدمة أثناء عملية التأجير فقط لغرض تنفيذ العقد والتواصل مع العميل.',
          'تتم حماية جميع البيانات وفقًا لسياسة الخصوصية الخاصة بنا، ولا تتم مشاركتها مع أي طرف ثالث دون موافقة العميل.'
        ]
      },
      {
        heading: '10. المسائل القانونية',
        paragraphs: [
          'تخضع هذه الشروط والأحكام لقوانين جمهورية أذربيجان.',
          'في حالة حدوث أي نزاع، يتعين على الطرفين السعي أولاً لحله وديًا، وإذا تعذر ذلك تُحال القضية إلى محاكم مدينة باكو.'
        ]
      }
    ]
  }
};

const Terms = () => {
  const { language } = useLanguage();
  const content = termsContent[language] ?? termsContent.az;
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  const alignment = language === 'ar' ? 'text-right' : 'text-left';

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-primary py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.title}</h1>
          <p className={`text-white/90 max-w-3xl mx-auto ${language === 'ar' ? 'text-right' : 'text-center'}`}>
            {content.intro}
          </p>
        </div>
      </section>

      <section className="py-12" dir={direction}>
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="space-y-6">
            {content.sections.map((section) => (
              <article key={section.heading} className="bg-white border border-border rounded-2xl shadow-sm p-6">
                <h2 className={`text-2xl font-semibold mb-4 ${alignment}`}>{section.heading}</h2>
                <div className={`space-y-3 text-muted-foreground leading-relaxed ${alignment}`}>
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={`${section.heading}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
