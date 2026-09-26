(function () {
  var V = window.AKARSU;
  var ayar = V.ayar;
  var il = V.iletisim;

  function tl(n) {
    return n.toLocaleString("tr-TR") + " TL";
  }

  function el(etiket, sinif, metin) {
    var e = document.createElement(etiket);
    if (sinif) e.className = sinif;
    if (metin != null) e.textContent = metin;
    return e;
  }

  function waAdresi(mesaj) {
    return "https://wa.me/" + il.telefonUluslararasi + "?text=" + encodeURIComponent(mesaj);
  }

  function taslakEtiketi() {
    return el("span", "etiket-taslak", "taslak");
  }

  // Önizleme şeridi
  if (ayar.taslak) {
    document.getElementById("onizleme").hidden = false;
    document.querySelectorAll("[data-taslak-etiket]").forEach(function (e) { e.hidden = false; });
  }

  // Bölge
  document.querySelectorAll("[data-bolge]").forEach(function (e) { e.textContent = il.bolge; });

  // Fiyat panosu
  var pano = document.getElementById("pano-liste");
  V.cihazlar.forEach(function (c) {
    var li = el("li");
    var a = el("a");
    a.href = "#cihaz-" + c.kod;
    a.appendChild(el("span", "pano-ad", c.ad));
    a.appendChild(el("span", "pano-fiyat", ayar.fiyatGoster ? tl(c.fiyat.pesin) : "Arayın"));
    li.appendChild(a);
    pano.appendChild(li);
  });
  if (!ayar.fiyatGoster) {
    document.getElementById("pano-not").textContent = "Güncel fiyat için arayın veya yazın.";
  }

  // Cihaz kartları
  var izgara = document.getElementById("cihaz-izgara");
  V.cihazlar.forEach(function (c) {
    var kart = el("article", "cihaz");
    kart.id = "cihaz-" + c.kod;

    var bas = el("div", "cihaz-bas");
    bas.appendChild(el("h3", null, c.ad));
    bas.appendChild(el("p", "cihaz-kisa", c.kisa));
    if (c.pompa === true) bas.appendChild(el("span", "rozet", "Pompalı"));
    if (c.pompa === false) bas.appendChild(el("span", "rozet", "Pompasız"));
    kart.appendChild(bas);

    var ul = el("ul", "ozellik");
    c.ozellikler.forEach(function (o) { ul.appendChild(el("li", null, o)); });
    kart.appendChild(ul);
    if (c.eksik) kart.appendChild(el("p", "eksik", c.eksik));

    var fiyat = el("div", "cihaz-fiyat");
    if (ayar.fiyatGoster) {
      var ust = el("div", "fiyat-ust");
      ust.appendChild(el("span", "fiyat-etiket", "Peşin"));
      if (ayar.taslak && !c.dogrulandi) ust.appendChild(taslakEtiketi());
      fiyat.appendChild(ust);
      fiyat.appendChild(el("p", "fiyat-buyuk", tl(c.fiyat.pesin)));
      var dl = el("dl", "fiyat-diger");
      [["Kredi kartı toplam", c.fiyat.kart], ["Elden taksit toplam", c.fiyat.elden]].forEach(function (s) {
        var d = el("div");
        d.appendChild(el("dt", null, s[0]));
        d.appendChild(el("dd", null, tl(s[1])));
        dl.appendChild(d);
      });
      fiyat.appendChild(dl);
    } else {
      fiyat.appendChild(el("p", "fiyat-buyuk fiyat-sor", "Fiyat için arayın"));
    }
    kart.appendChild(fiyat);

    var d = el("a", "dugme dugme-ana dugme-tam", "Bu cihazı sor");
    d.setAttribute("data-wa", "Merhaba, " + c.ad + " cihazı hakkında bilgi almak istiyorum.");
    kart.appendChild(d);

    izgara.appendChild(kart);
  });

  // Karşılaştırma tablosu
  var tablo = document.getElementById("karsilastirma");
  var thead = el("thead");
  var tr = el("tr");
  tr.appendChild(el("th", null, ""));
  V.cihazlar.forEach(function (c) {
    var th = el("th", null, c.ad);
    th.scope = "col";
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  tablo.appendChild(thead);
  var tbody = el("tbody");
  var satirlar = V.karsilastirma.slice();
  if (ayar.fiyatGoster) {
    var fiyatSatiri = { baslik: "Peşin fiyat", degerler: {} };
    V.cihazlar.forEach(function (c) { fiyatSatiri.degerler[c.kod] = tl(c.fiyat.pesin); });
    satirlar.unshift(fiyatSatiri);
  }
  satirlar.forEach(function (s) {
    var r = el("tr");
    var th = el("th", null, s.baslik);
    th.scope = "row";
    r.appendChild(th);
    V.cihazlar.forEach(function (c) {
      var v = s.degerler[c.kod];
      r.appendChild(el("td", v ? null : "bos", v || "–"));
    });
    tbody.appendChild(r);
  });
  tablo.appendChild(tbody);

  // Bakım paketleri
  var paketler = document.getElementById("paket-izgara");
  V.bakimPaketleri.forEach(function (p) {
    var k = el("article", "paket");
    k.appendChild(el("h3", null, p.ad));
    k.appendChild(el("p", "paket-not", p.not));
    var f = el("div", "paket-fiyat");
    if (ayar.fiyatGoster) {
      f.appendChild(el("span", "fiyat-buyuk", tl(p.fiyat)));
      if (ayar.taslak && !p.dogrulandi) f.appendChild(taslakEtiketi());
    } else {
      f.appendChild(el("span", "fiyat-buyuk fiyat-sor", "Fiyat için arayın"));
    }
    k.appendChild(f);
    var d = el("a", "dugme dugme-ikinci dugme-tam", "Bu paketi sor");
    d.setAttribute("data-wa", "Merhaba, " + p.ad + " bakım paketi hakkında bilgi almak istiyorum.");
    k.appendChild(d);
    paketler.appendChild(k);
  });

  // Bakım işlemleri
  var islem = document.getElementById("islem-liste");
  V.bakimIslemleri.forEach(function (i) {
    var li = el("li");
    li.appendChild(el("strong", null, i.baslik));
    li.appendChild(el("span", null, i.aciklama));
    islem.appendChild(li);
  });

  // Sorular
  var sss = document.getElementById("sss");
  V.sorular.forEach(function (s) {
    var d = el("details");
    d.appendChild(el("summary", null, s.soru));
    d.appendChild(el("p", null, s.cevap));
    sss.appendChild(d);
  });

  // Çalışma saatleri
  if (il.calismaSaatleri) {
    document.getElementById("saat-satir").hidden = false;
    document.getElementById("saat-yazi").textContent = il.calismaSaatleri;
  }

  // Telefon ve WhatsApp bağlantıları. Numara yoksa düğmeler pasif kalır
  var numaraVar = /^90\d{10}$/.test(il.telefonUluslararasi);
  document.querySelectorAll("[data-tel-yazi]").forEach(function (e) {
    e.textContent = numaraVar ? il.telefonGorunen : "Numara yakında";
  });
  document.querySelectorAll("[data-tel]").forEach(function (a) {
    if (numaraVar) a.href = "tel:+" + il.telefonUluslararasi;
    else { a.removeAttribute("href"); a.setAttribute("aria-disabled", "true"); }
  });
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    if (numaraVar) {
      a.href = waAdresi(a.getAttribute("data-wa"));
      a.target = "_blank";
      a.rel = "noopener";
    } else { a.removeAttribute("href"); a.setAttribute("aria-disabled", "true"); }
  });

  document.getElementById("yil").textContent = new Date().getFullYear();
})();
