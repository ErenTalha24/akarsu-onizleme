/*
  AKARSU ARITMA: SİTENİN TEK VERİ DOSYASI
  Fiyat, cihaz, paket ve iletişim bilgileri yalnızca burada değişir.

  dogrulandi: true  -> işletme onayladı
  dogrulandi: false -> afişten veya kullanıcı beyanından alındı, onay bekliyor

  Bu dosya herkese açık indirilir. İç not, komisyon, kişisel bilgi YAZILMAZ.
*/
window.AKARSU = {
  ayar: {
    // true iken sayfanın üstünde "önizleme" şeridi ve fiyatlarda "taslak" etiketi çıkar
    taslak: true,
    // false yapılırsa bütün fiyatlar gizlenir, yerine "Fiyat için arayın" yazar
    fiyatGoster: true
  },

  iletisim: {
    telefonGorunen: "0531 209 18 08",
    telefonUluslararasi: "905312091808",
    bolge: "İstanbul Anadolu Yakası",
    bolgeDogrulandi: false,
    adres: "",
    calismaSaatleri: ""
  },

  cihazlar: [
    {
      kod: "lg",
      ad: "LG So Good Purifier",
      kisa: "Tezgah altı su arıtma cihazı",
      pompa: null,
      ozellikler: [
        "Tezgah altı kurulum",
        "Nominal 8 litre tank"
      ],
      eksik: "Model kodu, filtre yapısı ve pompa bilgisi netleşiyor.",
      fiyat: { pesin: 10000, kart: 11000, elden: 14500 },
      dogrulandi: false
    },
    {
      kod: "hyundai",
      ad: "Hyundai HND-35",
      kisa: "Pompalı, 5 aşamalı ters ozmoz",
      pompa: true,
      ozellikler: [
        "Ters ozmoz (RO) arıtma",
        "5 filtre aşaması",
        "80 GPD membran",
        "Nominal 8 litre tank",
        "Pompalı, elektrik bağlantısı gerekir",
        "Tezgah altı kapalı kasa"
      ],
      eksik: "",
      fiyat: { pesin: 13500, kart: 14500, elden: 17500 },
      dogrulandi: false
    },
    {
      kod: "rostar",
      ad: "RO-STAR",
      kisa: "Tezgah altı su arıtma cihazı",
      pompa: null,
      ozellikler: [
        "Tezgah altı kurulum",
        "Kapalı kasa"
      ],
      eksik: "Model kodu, filtre yapısı ve tank bilgisi netleşiyor.",
      fiyat: { pesin: 16000, kart: 17000, elden: 20000 },
      dogrulandi: false
    },
    {
      kod: "ranger",
      ad: "RO-Toshiba Ranger Smart",
      kisa: "Pompasız ters ozmoz",
      pompa: false,
      ozellikler: [
        "Ters ozmoz (RO) arıtma",
        "80 GPD membran",
        "2,2 galon nominal tank",
        "Sediment, GAC ve blok karbon ön filtre",
        "Tezgah altı, pompasız"
      ],
      eksik: "",
      fiyat: { pesin: 17000, kart: 18000, elden: 21000 },
      dogrulandi: false
    }
  ],

  // Karşılaştırma tablosu. null = bilgi netleşiyor
  karsilastirma: [
    { baslik: "Kurulum", degerler: { lg: "Tezgah altı", hyundai: "Tezgah altı", rostar: "Tezgah altı", ranger: "Tezgah altı" } },
    { baslik: "Pompa", degerler: { lg: null, hyundai: "Var", rostar: null, ranger: "Yok" } },
    { baslik: "Arıtma", degerler: { lg: null, hyundai: "Ters ozmoz", rostar: null, ranger: "Ters ozmoz" } },
    { baslik: "Membran", degerler: { lg: null, hyundai: "80 GPD", rostar: null, ranger: "80 GPD" } },
    { baslik: "Nominal tank", degerler: { lg: "8 L", hyundai: "8 L", rostar: null, ranger: "2,2 galon" } },
    { baslik: "Elektrik", degerler: { lg: null, hyundai: "Gerekir", rostar: null, ranger: "Gerekmez" } }
  ],

  bakimPaketleri: [
    { ad: "Standart 5'li Set", fiyat: 1900, not: "Beş filtrenin değişimi", dogrulandi: false },
    { ad: "Premium 5'li Set", fiyat: 2400, not: "Beş filtrenin değişimi", dogrulandi: false },
    { ad: "Alkali 5'li Set", fiyat: 2900, not: "Beş filtrenin değişimi, alkali filtreli set", dogrulandi: false }
  ],

  // Bakım ziyaretinde yapılan işlemler. Hangi pakete dahil olduğu henüz netleşmedi
  bakimIslemleri: [
    { baslik: "Filtrelerin değişimi", aciklama: "Cihazdaki filtreler yenilenir, takılan filtreler size söylenir." },
    { baslik: "Tank hava basıncı kontrolü", aciklama: "Basınçlı tankın hava tarafı kontrol edilip uygun ekipmanla ayarlanır." },
    { baslik: "Hortumların temizliği", aciklama: "Hortumlar basınçlı suyla yıkanır." },
    { baslik: "Musluk bakımı", aciklama: "Arıtma musluğunun bakımı ve gerekiyorsa onarımı yapılır." },
    { baslik: "Bağlantıların sabitlenmesi", aciklama: "Hortum bağlantıları kontrol edilir, klipslerle sabitlenir." },
    { baslik: "Durulama", aciklama: "Yeni filtreler kullanıma geçmeden önce durulanır." }
  ],

  sorular: [
    {
      soru: "Pompalı mı almalıyım, pompasız mı?",
      cevap: "Ters ozmoz cihazları çalışmak için belirli bir şebeke basıncına ihtiyaç duyar. Evinizin su basıncı düşükse pompalı cihaz gerekir, pompalı cihaz ise prize bağlanır. Basıncı kurulumdan önce birlikte kontrol ediyor, ona göre öneriyoruz."
    },
    {
      soru: "Cihaz nereye kuruluyor, ne kadar yer kaplar?",
      cevap: "Cihazlarımızın hepsi tezgah altına, genellikle eviye dolabının içine kurulur. Dolabınızın ölçüsüne göre hangi cihazın sığacağını görüşmede netleştiriyoruz."
    },
    {
      soru: "Bakımda neler yapılıyor?",
      cevap: "Filtreler değiştirilir; tank basıncı, hortumlar, musluk ve bağlantılar kontrol edilir. Seçtiğiniz pakete neyin dahil olduğunu teklifte yazılı olarak veriyoruz."
    },
    {
      soru: "Fiyata neler dahil?",
      cevap: "Montaj, taksit sayısı ve ödeme şartlarını cihaz seçildikten sonra açıkça yazıyoruz. Aklınıza takılan her kalemi arayıp sorabilirsiniz."
    },
    {
      soru: "Garanti var mı?",
      cevap: "Garanti süresini ve kapsamını cihaz modeline göre satış sırasında yazılı olarak veriyoruz."
    },
    {
      soru: "Randevu nasıl alınıyor?",
      cevap: "Arayın veya WhatsApp'tan yazın. Size uygun günü birlikte belirleyip teyit ediyoruz."
    }
  ]
};
