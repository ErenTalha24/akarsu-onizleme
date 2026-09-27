/*
  AKARSU ARITMA: SİTENİN TEK VERİ DOSYASI
  Fiyat, cihaz, paket, soru ve iletişim bilgileri yalnızca burada değişir.

  dogrulandi: true  -> işletme onayladı, "taslak" rozeti kalkar
  dogrulandi: false -> afişten veya kullanıcı beyanından alındı, onay bekliyor

  Bu dosya herkese açık indirilir. İç not, komisyon, kişisel bilgi YAZILMAZ.
*/
window.AKARSU = {
  ayar: {
    // true iken onaylanmamış fiyatların altında "taslak fiyat" rozeti çıkar
    taslak: true,
    // false yapılırsa bütün fiyatlar gizlenir, yerine "Fiyat için arayın" yazar
    fiyatGoster: true
  },

  iletisim: {
    telefon: "0531 209 18 08",
    bolge: "İstanbul Anadolu Yakası",
    waMesaj: "Merhaba, su arıtma cihazları hakkında bilgi almak istiyorum.",
    calismaSaatleri: ""
  },

  cihazlar: [
    {
      kod: "lg",
      ad: "LG So Good Purifier",
      kisa: "Tezgah altı su arıtma cihazı",
      etiket: "Tezgah altı",
      bilgi: [
        ["Kurulum", "Tezgah altı"],
        ["Tank", "Nominal 8 litre"]
      ],
      eksik: "Model kodu, filtre yapısı ve pompa bilgisini görüşmede netleştiriyoruz.",
      fiyat: { pesin: 10000, kart: 11000, elden: 14500 },
      dogrulandi: false
    },
    {
      kod: "hyundai",
      ad: "Hyundai HND-35",
      kisa: "Pompalı, 5 aşamalı ters ozmoz",
      etiket: "Pompalı",
      bilgi: [
        ["Arıtma", "Ters ozmoz (RO), 5 filtre aşaması"],
        ["Membran", "80 GPD"],
        ["Tank", "Nominal 8 litre"],
        ["Pompa", "Var, elektrik bağlantısı gerekir"],
        ["Kurulum", "Tezgah altı, kapalı kasa"]
      ],
      eksik: "",
      fiyat: { pesin: 13500, kart: 14500, elden: 17500 },
      dogrulandi: false
    },
    {
      kod: "rostar",
      ad: "RO-STAR",
      kisa: "Tezgah altı su arıtma cihazı",
      etiket: "Tezgah altı",
      bilgi: [
        ["Kurulum", "Tezgah altı, kapalı kasa"]
      ],
      eksik: "Model kodu, filtre yapısı ve tank bilgisini görüşmede netleştiriyoruz.",
      fiyat: { pesin: 16000, kart: 17000, elden: 20000 },
      dogrulandi: false
    },
    {
      kod: "ranger",
      ad: "RO-Toshiba Ranger Smart",
      kisa: "Pompasız ters ozmoz",
      etiket: "Pompasız",
      bilgi: [
        ["Arıtma", "Ters ozmoz (RO)"],
        ["Membran", "80 GPD"],
        ["Tank", "2,2 galon nominal"],
        ["Ön filtre", "Sediment, GAC ve blok karbon"],
        ["Pompa", "Yok, elektrik gerekmez"],
        ["Kurulum", "Tezgah altı"]
      ],
      eksik: "",
      fiyat: { pesin: 17000, kart: 18000, elden: 21000 },
      dogrulandi: false
    }
  ],

  bakimPaketleri: [
    { ad: "Standart 5'li Set", kisa: "Beş filtrenin değişimi", fiyat: 1900, dogrulandi: false },
    { ad: "Premium 5'li Set", kisa: "Beş filtrenin değişimi", fiyat: 2400, dogrulandi: false },
    { ad: "Alkali 5'li Set", kisa: "Beş filtrenin değişimi, alkali filtreli set", fiyat: 2900, dogrulandi: false }
  ],

  // Bakım ziyaretinde yapılan işlemler. Hangi pakete dahil olduğu henüz netleşmedi
  bakimIslemleri: [
    "Filtrelerin değişimi",
    "Tank hava basıncının kontrolü ve ayarı",
    "Hortumların basınçlı suyla temizliği",
    "Musluğun bakımı, gerekiyorsa onarımı",
    "Bağlantıların kontrolü ve klipslerle sabitlenmesi",
    "Yeni filtrelerin durulanması"
  ],

  // Sarmal düzeninde sorular iki kolonda, başlıklı gruplar hâlinde durur
  soruGruplari: [
    {
      baslik: "Cihaz seçimi",
      sorular: [
        ["Pompalı mı almalıyım, pompasız mı?", "Ters ozmoz cihazları çalışmak için belirli bir şebeke basıncına ihtiyaç duyar. Evinizin su basıncı düşükse pompalı cihaz gerekir, pompalı cihaz ise prize bağlanır. Basıncı kurulumdan önce birlikte kontrol ediyor, ona göre öneriyoruz."],
        ["Cihaz nereye kuruluyor, ne kadar yer kaplar?", "Cihazlarımızın hepsi tezgah altına, genellikle eviye dolabının içine kurulur. Dolabınızın ölçüsüne göre hangi cihazın sığacağını görüşmede netleştiriyoruz."],
        ["Damacanaya göre hesaplı mı?", "Bu, evinizde ayda kaç damacana bittiğine bağlı. Aylık damacana harcamanızı cihaz ve bakım bedeliyle yan yana koyup birlikte hesaplıyoruz. Herkese aynı rakamı söylemiyoruz, çünkü herkesin tüketimi farklı."]
      ]
    },
    {
      baslik: "Bakım",
      sorular: [
        ["Bakımda neler yapılıyor?", "Filtreler değiştirilir; tank basıncı, hortumlar, musluk ve bağlantılar kontrol edilir. Seçtiğiniz pakete neyin dahil olduğunu teklifte yazılı olarak veriyoruz."],
        ["Paketler arasındaki fark ne?", "Üç paket de beş filtrelik settir. Aralarındaki farkı ve cihazınıza hangisinin uygun olduğunu görüşmede anlatıyoruz."]
      ]
    },
    {
      baslik: "Ödeme",
      sorular: [
        ["Fiyata neler dahil?", "Montaj, taksit sayısı ve ödeme şartlarını cihaz seçildikten sonra açıkça yazıyoruz. Aklınıza takılan her kalemi arayıp sorabilirsiniz."],
        ["Hangi ödeme seçenekleri var?", "Peşin, kredi kartı ve elden taksit. Sayfadaki kart ve elden taksit rakamları toplam bedeldir, aylık taksit değildir."],
        ["Garanti var mı?", "Garanti süresini ve kapsamını cihaz modeline göre satış sırasında yazılı olarak veriyoruz."]
      ]
    },
    {
      baslik: "Randevu",
      sorular: [
        ["Randevu nasıl alınıyor?", "Arayın veya WhatsApp'tan yazın. Size uygun günü birlikte belirleyip teyit ediyoruz."],
        ["Hangi bölgelere geliyorsunuz?", "İstanbul Anadolu Yakası'nda hizmet veriyoruz. İlçenizi yazın, gelebileceğimiz günü söyleyelim."]
      ]
    }
  ]
};
