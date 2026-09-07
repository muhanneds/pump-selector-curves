// ============================================================================
// MSP Pump Selector — translations (EN / TR / AR / ES)
//
// Only UI text is translated. Everything the selection engine keys on stays in
// English: material values ('Cast Iron'|'Noryl'|'Stainless Steel'), size codes
// ('4only'|'6plus'|'any'), frequencies ('50Hz'|'60Hz') and series tags. Model
// codes and numbers are never translated or localised to other digit systems —
// engineers read them the same way in every market.
// ============================================================================

const STORE_KEY_LANG = 'msp_lang_v1';

const LANGS = {
  en: { label: 'English',  code: 'EN', dir: 'ltr' },
  tr: { label: 'Türkçe',   code: 'TR', dir: 'ltr' },
  ar: { label: 'العربية',  code: 'AR', dir: 'rtl' },
  es: { label: 'Español',  code: 'ES', dir: 'ltr' }
};

const STRINGS = {
  en: {
    curveTitle:'Performance curve', powerTitle:'Power curve',
    keySelected:'Selected', keyOthers:'Other models', keyDuty:'Your duty point', keyDesign:'Design head',
    // --- Surface ranges: Horizontal (MMP) and Vertical (MTP) ---
    tabHorizontal:'Horizontal', tabVertical:'Vertical',
    horizontalTitle:'Horizontal multistage — MMP', verticalTitle:'Vertical line-shaft — MTP',
    speedRpm:'Speed (rpm)', driveType:'Drive', driveElectric:'Electric', driveDiesel:'Diesel',
    matches:'Matches', matchCount:'{n} shown of {all}',
    meetsDuty:'{head} m at Q={q} · {over} above duty',
    stagesLbl:'Stages', impeller:'Impeller', casing:'Casing', dnLbl:'Discharge',
    motorSuggested:'Motor', shaftPowerEst:'Shaft power (est.)',
    motorLadderNote:'Catalogue motor options: {list} kW. Shaft power estimated at {eff} pump efficiency — confirm before quoting.',
    absorbedPower:'Absorbed power', effPump:'Pump eff.', effMotor:'Motor eff.', effSystem:'System eff.',
    effNote:'Pump efficiency is calculated from the absorbed power published in the catalogue. Motor efficiency is an IE3 reference value, not an MSP motor test.',
    powerSuspect:'Efficiency withheld — the published absorbed power for this duty point fails a plausibility check.',
    noSurfaceMatch:'No pump in this range reaches {head} m at Q={q}',
    appTitle:'MSP Pump', tabSelector:'Selector', tabTender:'Tender',
    language:'Language',
    dutyPoint:'Duty point',
    material:'Material', matCast:'Cast Iron', matNoryl:'Noryl', matStainless:'Stainless Steel',
    boreSize:'Borehole size', size4:'4" only', size6:'6"+', sizeAny:'Any',
    frequency:'Frequency',
    flowQ:'Flow Q', headH:'Head H', safety:'Safety margin',
    designHead:'Design head {h} m · {ls} {u}', modelsIn:'{n} models in {tag}',
    selectedModel:'Selected model', selectedSeries:'Selected series',
    chooseToSee:'Choose {fields} to see a selection',
    fMaterial:'material', fBore:'borehole size', fFreq:'frequency', fFlow:'flow Q', fHead:'head H',
    outOfRange:'Out of range', noSeriesCovers:'No series covers this duty point',
    noMatch:'No match', noModelReaches:'No model in {tag} reaches {head} m at Q={q}',
    stagesResult:'{n} {stage} → {head} m at Q={q}', stage_one:'stage', stage_other:'stages',
    seriesSuffix:'{tag} series',
    motor:'Motor', motorPower:'Motor Power', hp:'HP', length:'Pump Length', selectedPump:'Selected Pump',
    alternative:'Alternative', none:'None',
    tender:'Tender', lines_one:'{n} line', lines_other:'{n} lines',
    noLines:'No line items yet. Add your first pump below.', addLine:'+ Add line item',
    enterQH:'Enter Q and H', enteredDuty:'Q={q} {u} · H={h} {hu}', bore:'Bore', freq:'Freq',
    flowQUnit:'Flow Q', headHUnit:'Head H',
    duplicate:'Duplicate', del:'Delete',
    lineDuplicated:'Line duplicated', lineRemoved:'Line removed',
    oorCaps:'OUT OF RANGE', noMatchIn:'No match in {tag}', altShort:'Alt',
    contactSales:'Contact our sales team for these specifications.',
    followUs:'Follow us', contactUs:'Contact us'
  },
  tr: {
    curveTitle:'Performans eğrisi', powerTitle:'Güç eğrisi',
    keySelected:'Seçilen', keyOthers:'Diğer modeller', keyDuty:'Çalışma noktanız', keyDesign:'Tasarım basma yüksekliği',
    // --- Yüzey gamları: Yatay (MMP) ve Dik milli (MTP) ---
    tabHorizontal:'Yatay', tabVertical:'Dik Milli',
    horizontalTitle:'Yatay kademeli — MMP', verticalTitle:'Dik milli — MTP',
    speedRpm:'Devir (d/dak)', driveType:'Tahrik', driveElectric:'Elektrik', driveDiesel:'Dizel',
    matches:'Eşleşmeler', matchCount:'{all} içinden {n} gösteriliyor',
    meetsDuty:'Q={q} değerinde {head} m · görevin {over} üzerinde',
    stagesLbl:'Kademe', impeller:'Fan çapı', casing:'Gövde', dnLbl:'Çıkış',
    motorSuggested:'Motor', shaftPowerEst:'Mil gücü (tahmini)',
    motorLadderNote:'Katalog motor seçenekleri: {list} kW. Mil gücü {eff} pompa verimi varsayımıyla tahmin edilmiştir — teklif öncesi doğrulayın.',
    absorbedPower:'Çekilen güç', effPump:'Pompa verimi', effMotor:'Motor verimi', effSystem:'Sistem verimi',
    effNote:'Pompa verimi katalogda yayımlanan çekilen güçten hesaplanmıştır. Motor verimi IE3 referans değeridir, MSP motor testi değildir.',
    powerSuspect:'Verim gösterilmiyor — bu çalışma noktası için yayımlanan çekilen güç makullük kontrolünden geçmedi.',
    noSurfaceMatch:'Bu gamda Q={q} değerinde {head} m sağlayan pompa yok',
    appTitle:'MSP Pompa', tabSelector:'Seçici', tabTender:'Teklif',
    language:'Dil',
    dutyPoint:'Çalışma noktası',
    material:'Malzeme', matCast:'Döküm', matNoryl:'Noryl', matStainless:'Paslanmaz Çelik',
    boreSize:'Kuyu çapı', size4:'Sadece 4"', size6:'6"+', sizeAny:'Tümü',
    frequency:'Frekans',
    flowQ:'Debi Q', headH:'Hm', safety:'Tolerans',
    designHead:'Tasarım yüksekliği {h} m · {ls} {u}', modelsIn:'{tag} serisinde {n} model',
    selectedModel:'Seçilen model', selectedSeries:'Seçilen seri',
    chooseToSee:'Seçim için {fields} girin',
    fMaterial:'malzeme', fBore:'kuyu çapı', fFreq:'frekans', fFlow:'debi Q', fHead:'basma yüksekliği H',
    outOfRange:'Aralık dışı', noSeriesCovers:'Bu çalışma noktasını karşılayan seri yok',
    noMatch:'Eşleşme yok', noModelReaches:'{tag} serisinde Q={q} değerinde {head} m sağlayan model yok',
    stagesResult:'{n} {stage} → {head} m, Q={q}', stage_one:'kademe', stage_other:'kademe',
    seriesSuffix:'{tag} serisi',
    motor:'Motor', motorPower:'Motor Gücü', hp:'HP', length:'Pompa Uzunluğu', selectedPump:'Seçilen Pompa',
    alternative:'Alternatif', none:'Yok',
    tender:'Teklif', lines_one:'{n} satır', lines_other:'{n} satır',
    noLines:'Henüz satır yok. İlk pompanızı aşağıdan ekleyin.', addLine:'+ Satır ekle',
    enterQH:'Q ve H girin', enteredDuty:'Q={q} {u} · H={h} {hu}', bore:'Kuyu', freq:'Frekans',
    flowQUnit:'Debi Q', headHUnit:'Hm',
    duplicate:'Çoğalt', del:'Sil',
    lineDuplicated:'Satır çoğaltıldı', lineRemoved:'Satır silindi',
    oorCaps:'ARALIK DIŞI', noMatchIn:'{tag} serisinde eşleşme yok', altShort:'Alt',
    contactSales:'Bu özellikler için satış ekibimizle iletişime geçin.',
    followUs:'Bizi takip edin', contactUs:'Bize ulaşın'
  },
  ar: {
    curveTitle:'منحنى الأداء', powerTitle:'منحنى القدرة',
    keySelected:'المختار', keyOthers:'موديلات أخرى', keyDuty:'نقطة التشغيل', keyDesign:'الرفع التصميمي',
    // --- المضخات السطحية: أفقية (MMP) وعمودية (MTP) ---
    tabHorizontal:'أفقية', tabVertical:'عمودية',
    horizontalTitle:'مضخات أفقية متعددة المراحل — MMP', verticalTitle:'مضخات عمودية بعمود إدارة — MTP',
    speedRpm:'السرعة (دورة/دقيقة)', driveType:'نوع التشغيل', driveElectric:'كهربائي', driveDiesel:'ديزل',
    matches:'النتائج', matchCount:'عرض {n} من {all}',
    meetsDuty:'{head} m عند Q={q} · أعلى من المطلوب بنسبة {over}',
    stagesLbl:'المراحل', impeller:'قطر الدافعة', casing:'ضغط الجسم', dnLbl:'فتحة الطرد',
    motorSuggested:'المحرك', shaftPowerEst:'قدرة العمود (تقديرية)',
    motorLadderNote:'خيارات المحرك في الكتالوج: {list} kW. قدرة العمود مقدّرة بافتراض كفاءة مضخة {eff} — يرجى التأكد قبل التسعير.',
    absorbedPower:'القدرة الممتصة', effPump:'كفاءة المضخة', effMotor:'كفاءة المحرك', effSystem:'كفاءة النظام',
    effNote:'كفاءة المضخة محسوبة من القدرة الممتصة المنشورة في الكتالوج. كفاءة المحرك قيمة مرجعية IE3 وليست اختبار محرك MSP.',
    powerSuspect:'الكفاءة غير معروضة — القدرة الممتصة المنشورة لهذه النقطة لا تجتاز فحص المعقولية.',
    noSurfaceMatch:'لا توجد مضخة في هذا النطاق تصل إلى {head} m عند Q={q}',
    appTitle:'مضخات MSP', tabSelector:'المحدد', tabTender:'العطاء',
    language:'اللغة',
    dutyPoint:'نقطة التشغيل',
    material:'المادة', matCast:'حديد زهر', matNoryl:'نوريل', matStainless:'فولاذ مقاوم للصدأ',
    boreSize:'قطر البئر', size4:'4" فقط', size6:'6"+', sizeAny:'الكل',
    frequency:'التردد',
    flowQ:'التدفق Q', headH:'الرفع H', safety:'هامش الأمان',
    designHead:'رفع التصميم {h} m · {ls} {u}', modelsIn:'{n} موديل في {tag}',
    selectedModel:'الموديل المختار', selectedSeries:'السلسلة المختارة',
    chooseToSee:'اختر {fields} لعرض النتيجة',
    fMaterial:'المادة', fBore:'قطر البئر', fFreq:'التردد', fFlow:'التدفق Q', fHead:'الرفع H',
    outOfRange:'خارج النطاق', noSeriesCovers:'لا توجد سلسلة تغطي نقطة التشغيل هذه',
    noMatch:'لا يوجد تطابق', noModelReaches:'لا يوجد موديل في {tag} يصل إلى {head} m عند Q={q}',
    stagesResult:'{n} {stage} ← {head} m عند Q={q}', stage_one:'مرحلة', stage_other:'مراحل',
    seriesSuffix:'سلسلة {tag}',
    motor:'المحرك', motorPower:'قدرة المحرك', hp:'HP', length:'طول المضخة', selectedPump:'المضخة المختارة',
    alternative:'بديل', none:'لا يوجد',
    tender:'العطاء', lines_one:'{n} بند', lines_other:'{n} بنود',
    noLines:'لا توجد بنود بعد. أضف أول مضخة أدناه.', addLine:'+ إضافة بند',
    enterQH:'أدخل Q و H', enteredDuty:'Q={q} {u} · H={h} {hu}', bore:'البئر', freq:'التردد',
    flowQUnit:'التدفق Q', headHUnit:'الرفع H',
    duplicate:'نسخ', del:'حذف',
    lineDuplicated:'تم نسخ البند', lineRemoved:'تم حذف البند',
    oorCaps:'خارج النطاق', noMatchIn:'لا يوجد تطابق في {tag}', altShort:'بديل',
    contactSales:'تواصل مع فريق المبيعات لهذه المواصفات.',
    followUs:'تابعنا', contactUs:'تواصل معنا'
  },
  es: {
    curveTitle:'Curva de rendimiento', powerTitle:'Curva de potencia',
    keySelected:'Seleccionada', keyOthers:'Otros modelos', keyDuty:'Su punto de trabajo', keyDesign:'Altura de diseño',
    // --- Gamas de superficie: Horizontal (MMP) y Vertical (MTP) ---
    tabHorizontal:'Horizontal', tabVertical:'Vertical',
    horizontalTitle:'Multietapa horizontal — MMP', verticalTitle:'Eje vertical — MTP',
    speedRpm:'Velocidad (rpm)', driveType:'Accionamiento', driveElectric:'Eléctrico', driveDiesel:'Diésel',
    matches:'Coincidencias', matchCount:'{n} de {all} mostradas',
    meetsDuty:'{head} m con Q={q} · {over} por encima del punto',
    stagesLbl:'Etapas', impeller:'Impulsor', casing:'Carcasa', dnLbl:'Descarga',
    motorSuggested:'Motor', shaftPowerEst:'Potencia al eje (est.)',
    motorLadderNote:'Opciones de motor del catálogo: {list} kW. Potencia al eje estimada con un rendimiento de bomba de {eff} — confirmar antes de cotizar.',
    absorbedPower:'Potencia absorbida', effPump:'Rend. bomba', effMotor:'Rend. motor', effSystem:'Rend. sistema',
    effNote:'El rendimiento de la bomba se calcula con la potencia absorbida publicada en el catálogo. El del motor es un valor de referencia IE3, no un ensayo de motor MSP.',
    powerSuspect:'Rendimiento no mostrado — la potencia absorbida publicada para este punto no supera la comprobación de coherencia.',
    noSurfaceMatch:'Ninguna bomba de esta gama alcanza {head} m con Q={q}',
    appTitle:'Bombas MSP', tabSelector:'Selector', tabTender:'Licitación',
    language:'Idioma',
    dutyPoint:'Punto de trabajo',
    material:'Material', matCast:'Hierro fundido', matNoryl:'Noryl', matStainless:'Acero inoxidable',
    boreSize:'Diámetro del pozo', size4:'Solo 4"', size6:'6"+', sizeAny:'Cualquiera',
    frequency:'Frecuencia',
    flowQ:'Caudal Q', headH:'Altura H', safety:'Tolerancia',
    designHead:'Altura de diseño {h} m · {ls} {u}', modelsIn:'{n} modelos en {tag}',
    selectedModel:'Modelo seleccionado', selectedSeries:'Serie seleccionada',
    chooseToSee:'Elija {fields} para ver una selección',
    fMaterial:'material', fBore:'diámetro del pozo', fFreq:'frecuencia', fFlow:'caudal Q', fHead:'altura H',
    outOfRange:'Fuera de rango', noSeriesCovers:'Ninguna serie cubre este punto de trabajo',
    noMatch:'Sin coincidencia', noModelReaches:'Ningún modelo en {tag} alcanza {head} m con Q={q}',
    stagesResult:'{n} {stage} → {head} m con Q={q}', stage_one:'etapa', stage_other:'etapas',
    seriesSuffix:'serie {tag}',
    motor:'Motor', motorPower:'Potencia del motor', hp:'HP', length:'Longitud de bomba', selectedPump:'Bomba seleccionada',
    alternative:'Alternativa', none:'Ninguna',
    tender:'Licitación', lines_one:'{n} línea', lines_other:'{n} líneas',
    noLines:'Aún no hay líneas. Agregue su primera bomba abajo.', addLine:'+ Agregar línea',
    enterQH:'Ingrese Q y H', enteredDuty:'Q={q} {u} · H={h} {hu}', bore:'Pozo', freq:'Frec.',
    flowQUnit:'Caudal Q', headHUnit:'Altura H',
    duplicate:'Duplicar', del:'Eliminar',
    lineDuplicated:'Línea duplicada', lineRemoved:'Línea eliminada',
    oorCaps:'FUERA DE RANGO', noMatchIn:'Sin coincidencia en {tag}', altShort:'Alt',
    contactSales:'Contacte a nuestro equipo de ventas para estas especificaciones.',
    followUs:'Síguenos', contactUs:'Contáctenos'
  }
};

// Engine values -> translation keys. The values must never change.
const MATERIAL_KEY = { 'Cast Iron':'matCast', 'Noryl':'matNoryl', 'Stainless Steel':'matStainless' };
const SIZE_KEY     = { '4only':'size4', '6plus':'size6', 'any':'sizeAny' };

let currentLang = loadLang();

function loadLang(){
  try{
    const saved = localStorage.getItem(STORE_KEY_LANG);
    if (saved && LANGS[saved]) return saved;
    const nav = (navigator.language || 'en').slice(0,2).toLowerCase();
    if (LANGS[nav]) return nav;
  }catch(e){}
  return 'en';
}

function setLang(lang){
  if (!LANGS[lang]) return;
  currentLang = lang;
  try{ localStorage.setItem(STORE_KEY_LANG, lang); }catch(e){}
  applyLangToDocument();
}

function applyLangToDocument(){
  const html = document.documentElement;
  html.setAttribute('lang', currentLang);
  html.setAttribute('dir', LANGS[currentLang].dir);
}

/** Translate `key`, substituting {placeholders} from `vars`. */
function t(key, vars){
  const table = STRINGS[currentLang] || STRINGS.en;
  let s = table[key];
  if (s === undefined) s = STRINGS.en[key];
  if (s === undefined) return key;
  if (vars){
    for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  }
  return s;
}

/** Plural helper: picks `<key>_one` or `<key>_other` by count. */
function tn(key, n, vars){
  const form = (Number(n) === 1) ? '_one' : '_other';
  return t(key + form, Object.assign({ n: n }, vars || {}));
}

function materialLabel(v){ return t(MATERIAL_KEY[v] || 'material'); }
function sizeLabel(v){ return t(SIZE_KEY[v] || 'sizeAny'); }

/** Isolate technical text (model codes, numbers) so RTL never reorders it. */
function bidi(s){ return '<bdi>' + s + '</bdi>'; }

applyLangToDocument();
