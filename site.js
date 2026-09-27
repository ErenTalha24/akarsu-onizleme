/* ===================== AKARSU ARITMA =====================
   Düzen, hareketler ve kod Sarmal Dijital sitesinden birebir alındı.
   Değişen tek şey içerik: fiyat, cihaz, paket ve sorular veri.js'ten
   okunuyor. Rakam değiştirmek için yalnızca veri.js düzenlenir.        */
const V = window.AKARSU;
const MARKA = {
  telefon:         V.iletisim.telefon,
  bolge:           V.iletisim.bolge,
  calismaSaatleri: V.iletisim.calismaSaatleri,
  waMesaj:         V.iletisim.waMesaj,
};

document.documentElement.classList.add('js');

const trBicim = new Intl.NumberFormat('tr-TR');
const tl = n => trBicim.format(n) + ' \u20BA';
const kacis = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const BILGI_IKON = '<svg width="8" height="9" viewBox="0 0 8 9" fill="none" aria-hidden="true"><path d="M4 3.6v3.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="4" cy="1.7" r=".85" fill="currentColor"/></svg>';

/* Fiyat tablosunun bir satırı: Sarmal'daki yapının aynısı */
function fiyatSatiri({kimlik, ad, ac, sure, balonUst, balonMetin, dl, liste, not, rakam, alt, secim, dogrulandi}){
  const fiyatVar = V.ayar.fiyatGoster;
  const taslak = V.ayar.taslak && !dogrulandi && fiyatVar;
  return `
      <div class="fiyat-satir gir">
        <div class="ad">${kacis(ad)}<div class="bilgi-sar"><button class="bilgi-dugme" type="button" aria-expanded="false" aria-controls="bb-${kimlik}" aria-label="${kacis(ad)} hakkında bilgi">${BILGI_IKON}</button>
          <div class="bilgi-balon" id="bb-${kimlik}" role="dialog" aria-label="${kacis(ad)} hakkında">
            <div class="bb-ust">${kacis(balonUst)}</div>
            <h4>${kacis(ad)}</h4>
            <p>${kacis(balonMetin)}</p>
            ${dl && dl.length ? '<dl>' + dl.map(([a,b]) => `<dt>${kacis(a)}</dt><dd>${kacis(b)}</dd>`).join('') + '</dl>' : ''}
            ${liste ? '<ul>' + liste.map(x => `<li>${kacis(x)}</li>`).join('') + '</ul>' : ''}
            ${not ? `<div class="bb-not">${not}</div>` : ''}
          </div></div><span class="ac">${kacis(ac)}</span></div>
        <div class="sure">${kacis(sure)}</div>
        <div class="tutar">
          <span class="rakam">${fiyatVar ? tl(rakam) : 'Fiyat için arayın'}</span>
          ${fiyatVar && alt ? `<span class="yillik">${alt}</span>` : ''}
          ${taslak ? '<span class="taslak-rozet">Taslak fiyat</span>' : ''}
          <button class="paket-sec" type="button" data-secim="${kacis(secim)}">${secim.includes('Set') ? 'Bu paketi istiyorum' : 'Bu cihazı istiyorum'}</button>
        </div>
      </div>`;
}

(function sayfaKur(){
  document.getElementById('cihaz-tablo').innerHTML = V.cihazlar.map((c, i) => fiyatSatiri({
    kimlik: c.kod, ad: c.ad, ac: c.kisa, sure: c.etiket,
    balonUst: 'Cihaz 0' + (i + 1) + ' · ' + c.etiket,
    balonMetin: c.kisa + '.',
    dl: c.bilgi,
    not: c.eksik ? '<b style="color:var(--sonuk)">Netleşiyor.</b> ' + kacis(c.eksik) : '',
    rakam: c.fiyat.pesin,
    alt: 'Kart toplam <b>' + tl(c.fiyat.kart) + '</b><br>Elden taksit toplam <b>' + tl(c.fiyat.elden) + '</b>',
    secim: c.ad, dogrulandi: c.dogrulandi,
  })).join('');

  document.getElementById('bakim-tablo').innerHTML = V.bakimPaketleri.map((p, i) => fiyatSatiri({
    kimlik: 'paket' + (i + 1), ad: p.ad, ac: p.kisa, sure: "5'li set",
    balonUst: 'Paket 0' + (i + 1) + " · 5'li filtre seti",
    balonMetin: 'Bakım ziyaretinde yapılan işlemler:',
    liste: V.bakimIslemleri,
    not: '<b style="color:var(--sonuk)">Kapsam.</b> Hangi işlemin bu pakete dahil olduğu teklifte yazılı olarak verilir.',
    rakam: p.fiyat, alt: '', secim: p.ad, dogrulandi: p.dogrulandi,
  })).join('');

  document.getElementById('bakim-islemleri').innerHTML =
    V.bakimIslemleri.map(x => `<li>${kacis(x)}</li>`).join('');

  const secenek = [...V.cihazlar.map(c => c.ad), ...V.bakimPaketleri.map(p => p.ad),
                   'Henüz emin değilim, konuşalım'];
  document.getElementById('ilgi').innerHTML = secenek.map(s => `<option>${kacis(s)}</option>`).join('');

  /* sorular Sarmal'daki gibi iki kolonda, başlıklı gruplar */
  const gruplar = V.soruGruplari;
  const yari = Math.ceil(gruplar.length / 2);
  const kolon = liste => '<div class="fsss-kolon">' + liste.map(g => `
<div class="fsss-sutun">
          <h4>${kacis(g.baslik)}</h4>
${g.sorular.map(([s, c]) => `<details>
            <summary>${kacis(s)}</summary>
            <div class="sss-govde"><div class="sss-ic">
            <p>${kacis(c)}</p>
            </div></div>
            </details>`).join('\n')}
        </div>`).join('') + '</div>';
  document.getElementById('sss').innerHTML = kolon(gruplar.slice(0, yari)) + kolon(gruplar.slice(yari));

  document.getElementById('yil').textContent = new Date().getFullYear();
})();

(function markaUygula(){
  /* Telefonu tek bicime indirger: 0531..., +90 531..., 90531... hepsi
     905312091808 olur. Onceki '9'+rakam hilesi +90 ile baslayan numarada
     cift ulke kodu uretiyordu. */
  window.waNumara = () => {
    let r = (MARKA.telefon || '').replace(/\D/g, '');
    if (!r) return '';
    if (r.startsWith('90')) r = r.slice(2);
    if (r.startsWith('0'))  r = r.slice(1);
    return r ? '90' + r : '';
  };

  const yaz = (a,d) => { if(!d) return;
    document.querySelectorAll('[data-marka="'+a+'"]').forEach(e => e.textContent = d); };
  yaz('bolge', MARKA.bolge); yaz('telefon', MARKA.telefon); yaz('calismaSaatleri', MARKA.calismaSaatleri);

  const bagla = (a, href) => document.querySelectorAll('[data-marka="'+a+'"]')
    .forEach(e => { if(href) e.href = href; });

  if (waNumara()) {
    bagla('tel-link', 'tel:+' + waNumara());
    bagla('wa-link', 'https://wa.me/' + waNumara() + '?text=' + encodeURIComponent(MARKA.waMesaj));
  }
  /* Bilgisi girilmemis kanal sayfada gorunmez. Yoksa HTML'deki ornek
     deger (merhaba@sarmaldijital.com gibi) gercekmis gibi duruyor ve
     musteri olmayan bir adrese yaziyor. */
  document.querySelectorAll('[data-gerekli]').forEach(oge => {
    if (!MARKA[oge.dataset.gerekli]) oge.remove();
  });

})();

/* ---- yumusak kaydirma ----
   Tarayicinin scroll-behavior:smooth suresi ve egrisi ayarlanamiyor;
   mesafe uzadikca sertlesiyor. Burada kendi egrimizi kullaniyoruz:
   yavas baslar, ortada hizlanir, yavaslayarak durur (easeInOutCubic).
   Sure mesafeye gore 620-1180ms arasinda oluyor. */
const KAYDIR_PAY = 86;   /* sabit ust cubuk icin bosluk */

function yumusakKaydir(hedef, bitince){
  const azHareket = matchMedia('(prefers-reduced-motion: reduce)');
  const bas  = window.pageYOffset;
  const son  = Math.max(0, Math.min(
    hedef.getBoundingClientRect().top + bas - KAYDIR_PAY,
    document.documentElement.scrollHeight - innerHeight));
  const yol  = son - bas;

  if (azHareket.matches || Math.abs(yol) < 4){
    window.scrollTo(0, son); bitince && bitince(); return;
  }

  /* mesafe uzadikca sure artar ama bir yerde durur */
  const sure = Math.min(1180, Math.max(620, Math.abs(yol) * 0.55));
  const egri = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
  const basla = performance.now();
  let iptal = false;

  /* kullanici tekerlege veya parmagina davranirsa animasyon birakilir */
  const birak = () => { iptal = true; temizle(); };
  const temizle = () => {
    removeEventListener('wheel', birak); removeEventListener('touchstart', birak);
    removeEventListener('keydown', tusKontrol);
  };
  const tusKontrol = (e) => {
    if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key)) birak();
  };
  addEventListener('wheel', birak, {passive:true});
  addEventListener('touchstart', birak, {passive:true});
  addEventListener('keydown', tusKontrol);

  const adim = (simdi) => {
    if (iptal) return;
    const t = Math.min(1, (simdi - basla) / sure);
    window.scrollTo(0, bas + yol * egri(t));
    if (t < 1) requestAnimationFrame(adim);
    else { temizle(); bitince && bitince(); }
  };
  requestAnimationFrame(adim);
}

/* Sayfa ici tum capa baglantilari bu motordan gecer */
document.addEventListener('click', (e) => {
  const bag = e.target.closest('a[href^="#"]');
  if (!bag) return;
  const kimlik = bag.getAttribute('href');
  if (!kimlik || kimlik === '#') return;
  const hedef = document.querySelector(kimlik);
  if (!hedef) return;

  e.preventDefault();
  yumusakKaydir(hedef, () => {
    /* adres cubugu guncellensin ama ekstra zipla olmasin */
    history.replaceState(null, '', kimlik);
  });
});

/* üst çubuk: sayfa kaydırılınca zemin kazanır */
const ust = document.getElementById('ust');
const cubuk = () => ust.classList.toggle('yapisik', scrollY > 12);
cubuk(); addEventListener('scroll', cubuk, {passive:true});

/* telefon menüsü */
const burger = document.getElementById('burger'), mob = document.getElementById('mobMenu');
burger.addEventListener('click', () => {
  const acik = mob.classList.toggle('acik');
  burger.setAttribute('aria-expanded', acik);
  burger.setAttribute('aria-label', acik ? 'Menüyü kapat' : 'Menüyü aç');
});
mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mob.classList.remove('acik'); burger.setAttribute('aria-expanded','false');
  burger.setAttribute('aria-label','Menüyü aç');
}));

/* ===================== SILK ARKA PLANI =====================
   React Bits'teki Silk bileşeninin gölgelendiricisi, saf WebGL ile.
   Orijinali React + Three.js istiyor; bu projede ikisi de yok, o yüzden
   aynı gölgelendirici doğrudan çalıştırılıyor. Görsel sonuç aynı,
   dışarıdan hiçbir paket gerekmiyor.

   Ayarlar React Bits panelindeki değerlerle birebir aynı.          */
const SILK = {
  hiz:            2,          /* speed · React Bits'te 5'ti, gözü yorduğu için düşürüldü */
  olcek:          1,          /* scale */
  renk:           '#7fd3da',  /* color · Akarsu: açık turkuaz */
  gurultu:        1.5,        /* noiseIntensity */
  donme:          0,          /* rotation, radyan */
};

(function silkKur(){
  const tuval = document.getElementById('silk');
  if (!tuval) return;

  const azHareket = matchMedia('(prefers-reduced-motion: reduce)');

  const gl = tuval.getContext('webgl', {
    alpha: false, antialias: false, depth: false, stencil: false,
    powerPreference: 'low-power', preserveDrawingBuffer: true,
  }) || tuval.getContext('experimental-webgl');

  /* WebGL yoksa sessizce vazgeç: hero eski haliyle çalışmaya devam eder */
  if (!gl){ tuval.remove(); return; }

  const kaynakDikey = `
    attribute vec2 aKonum;
    varying vec2 vUv;
    void main(){
      vUv = aKonum * 0.5 + 0.5;
      gl_Position = vec4(aKonum, 0.0, 1.0);
    }`;

  const kaynakParca = `
    precision mediump float;
    varying vec2 vUv;
    uniform float uZaman, uHiz, uOlcek, uDonme, uGurultu, uOran;
    uniform vec3  uRenk;

    const float e = 2.71828182845904523536;

    float gurultu(vec2 k){
      float G = e;
      vec2  r = (G * sin(G * k));
      return fract(r.x * r.y * (1.0 + k.x));
    }

    vec2 dondur(vec2 uv, float aci){
      float c = cos(aci), s = sin(aci);
      return mat2(c, -s, s, c) * uv;
    }

    void main(){
      float rnd = gurultu(gl_FragCoord.xy);

      /* Geniş ekranda desen ezilmesin diye yatayı en boy oranıyla düzeltiyoruz.
         React Bits örneği kare bir alanda duruyordu, burada alan geniş. */
      vec2 uv = vUv;
      uv.x *= uOran;

      uv  = dondur(uv * uOlcek, uDonme);
      vec2 tex = uv * uOlcek;
      float t = uHiz * uZaman;

      tex.y += 0.03 * sin(8.0 * tex.x - t);

      float desen = 0.6 + 0.4 * sin(
        5.0 * (tex.x + tex.y + cos(3.0 * tex.x + 5.0 * tex.y) + 0.02 * t)
        + sin(20.0 * (tex.x + tex.y - 0.1 * t))
      );

      vec3 renk = uRenk * desen - rnd / 15.0 * uGurultu;
      gl_FragColor = vec4(renk, 1.0);
    }`;

  function derle(tip, kaynak){
    const g = gl.createShader(tip);
    gl.shaderSource(g, kaynak);
    gl.compileShader(g);
    if (!gl.getShaderParameter(g, gl.COMPILE_STATUS)){
      console.warn('Silk gölgelendirici derlenemedi:', gl.getShaderInfoLog(g));
      gl.deleteShader(g); return null;
    }
    return g;
  }

  const gDikey = derle(gl.VERTEX_SHADER, kaynakDikey);
  const gParca = derle(gl.FRAGMENT_SHADER, kaynakParca);
  if (!gDikey || !gParca){ tuval.remove(); return; }

  const program = gl.createProgram();
  gl.attachShader(program, gDikey);
  gl.attachShader(program, gParca);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)){ tuval.remove(); return; }
  gl.useProgram(program);

  /* tam ekranı kaplayan iki üçgen */
  const arabellek = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, arabellek);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const konum = gl.getAttribLocation(program, 'aKonum');
  gl.enableVertexAttribArray(konum);
  gl.vertexAttribPointer(konum, 2, gl.FLOAT, false, 0, 0);

  const yer = a => gl.getUniformLocation(program, a);
  const uZaman = yer('uZaman'), uOran = yer('uOran');

  const r = parseInt(SILK.renk.slice(1,3),16)/255,
        y = parseInt(SILK.renk.slice(3,5),16)/255,
        m = parseInt(SILK.renk.slice(5,7),16)/255;
  gl.uniform3f(yer('uRenk'), r, y, m);
  gl.uniform1f(yer('uHiz'),     SILK.hiz);
  gl.uniform1f(yer('uOlcek'),   SILK.olcek);
  gl.uniform1f(yer('uDonme'),   SILK.donme);
  gl.uniform1f(yer('uGurultu'), SILK.gurultu);

  /* --- ölçü --- */
  function olcuAl(){
    /* Telefonda piksel yoğunluğunu sınırlıyoruz: aynı görüntü, üçte bir yük */
    const dpr = Math.min(devicePixelRatio || 1, innerWidth < 900 ? 1 : 1.5);
    const g = Math.max(1, Math.round(tuval.clientWidth  * dpr));
    const y2 = Math.max(1, Math.round(tuval.clientHeight * dpr));
    if (tuval.width !== g || tuval.height !== y2){
      tuval.width = g; tuval.height = y2;
      gl.viewport(0, 0, g, y2);
    }
    gl.uniform1f(uOran, tuval.clientWidth / Math.max(1, tuval.clientHeight));
  }

  function ciz(saniye){
    gl.uniform1f(uZaman, saniye);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    kareSayisi++;
  }

  let kimlik = 0, calisiyor = false, gorunur = true, sekmeAcik = true;
  let baslangic = performance.now(), gecen = 0, kareSayisi = 0;

  function dongu(simdi){
    kimlik = requestAnimationFrame(dongu);
    gecen = (simdi - baslangic) / 1000;
    ciz(gecen);
  }
  function baslat(){
    if (calisiyor || azHareket.matches) return;
    calisiyor = true;
    baslangic = performance.now() - gecen * 1000;   /* kaldığı yerden */
    kimlik = requestAnimationFrame(dongu);
  }
  function durdur(){
    if (!calisiyor) return;
    calisiyor = false;
    cancelAnimationFrame(kimlik);
  }
  const durumaBak = () => (gorunur && sekmeAcik) ? baslat() : durdur();

  /* --- ilk kare --- */
  olcuAl();
  ciz(0);
  requestAnimationFrame(() => tuval.classList.add('hazir'));

  /* Hareketi azalt açıksa tek kare kalır, animasyon hiç başlamaz */
  if (azHareket.matches){
    ciz(2.4);   /* durağan ama desenli bir kare */
  }

  /* --- olay bağlantıları --- */
  const boyutGozcu = new ResizeObserver(() => { olcuAl(); if (!calisiyor) ciz(gecen); });
  boyutGozcu.observe(tuval);

  const gorunurlukGozcu = new IntersectionObserver(
    ([g]) => { gorunur = g.isIntersecting; durumaBak(); }, {threshold:0});
  gorunurlukGozcu.observe(tuval);

  const sekmeDegisti = () => { sekmeAcik = !document.hidden; durumaBak(); };
  document.addEventListener('visibilitychange', sekmeDegisti);

  const hareketDegisti = () => { azHareket.matches ? (durdur(), ciz(2.4)) : baslat(); };
  azHareket.addEventListener ? azHareket.addEventListener('change', hareketDegisti)
                             : azHareket.addListener(hareketDegisti);

  /* Bağlam kaybında (sekme uykuya daldığında olur) çökme yerine sessiz duruş */
  tuval.addEventListener('webglcontextlost', (e) => { e.preventDefault(); durdur(); });

  durumaBak();

  /* Dışarıdan bakılabilen durum penceresi: hata ayıklama ve test için. */
  window.silkDurum = () => ({
    calisiyor, gorunur, sekmeAcik, kareSayisi,
    azHareket: azHareket.matches,
    olcu: [tuval.width, tuval.height],
  });

  /* --- temizlik ---
     Bileşen kaldırıldığında döngü, gözcüler, olaylar ve WebGL kaynakları
     serbest bırakılır. Konsoldan silkTemizle() ile de çağrılabilir. */
  window.silkTemizle = function(){
    durdur();
    boyutGozcu.disconnect();
    gorunurlukGozcu.disconnect();
    document.removeEventListener('visibilitychange', sekmeDegisti);
    azHareket.removeEventListener ? azHareket.removeEventListener('change', hareketDegisti)
                                  : azHareket.removeListener(hareketDegisti);
    gl.deleteBuffer(arabellek);
    gl.deleteProgram(program);
    gl.deleteShader(gDikey);
    gl.deleteShader(gParca);
    const kayip = gl.getExtension('WEBGL_lose_context');
    if (kayip) kayip.loseContext();
    tuval.remove();
    delete window.silkTemizle;
    delete window.silkDurum;
  };
})();

/* ---- Dock etkisi ----
   İmleç bir ögeye yaklaştıkça o öge öne çıkar, komşuları mesafeye göre
   daha az. macOS Dock'un büyüme eğrisi: kosinüs tabanlı yumuşak düşüş.

   Üç yerde kullanılıyor:
     · güvence şeridi   → yatay, öge yukarı kalkıyor
     · fiyat tablosu    → dikey, satır sağa kayıyor
     · süreç adımları   → dikey, adım sağa kayıyor

   JS yalnız "ne kadar yakın" bilgisini (--yakinlik, 0-1) yazıyor;
   bunun nasıl görüneceğine CSS karar veriyor.

   Yalnız fareyle kullanılan geniş ekranlarda çalışır; dokunmatikte,
   dar ekranda ve "hareketi azalt" açıkken devre dışı kalır. */
const dockListesi = [];

function dockKur(seritSecici, hucreSecici, yon, enAzGenislik){
  const serit = document.querySelector(seritSecici);
  if (!serit) return;
  const hucreler = [...serit.querySelectorAll(hucreSecici)];
  if (!hucreler.length) return;

  const azHareket = matchMedia('(prefers-reduced-motion: reduce)');
  const fareVar   = matchMedia('(hover: hover) and (pointer: fine)');
  const yeterinceGenis = () => innerWidth > enAzGenislik;
  const yatayMi = yon === 'yatay';

  const ETKI_ALANI = yatayMi ? 2.3 : 1.9;   /* kaç öge öteye kadar hissedilsin */

  let fareK = null, kimlik = 0, merkezler = [], adim = 0;

  function olcuAl(){
    const k = serit.getBoundingClientRect();
    adim = (yatayMi ? k.width : k.height) / hucreler.length;
    merkezler = hucreler.map(h => {
      const r = h.getBoundingClientRect();
      return yatayMi ? r.left + r.width / 2 : r.top + r.height / 2;
    });
  }

  function uygula(){
    kimlik = 0;
    if (fareK === null){ hucreler.forEach(h => h.style.setProperty('--yakinlik', 0)); return; }
    for (let i = 0; i < hucreler.length; i++){
      const uzaklik = Math.abs(fareK - merkezler[i]) / (adim * ETKI_ALANI);
      const yakinlik = uzaklik >= 1 ? 0 : (Math.cos(uzaklik * Math.PI) + 1) / 2;
      hucreler[i].style.setProperty('--yakinlik', yakinlik.toFixed(3));
    }
  }
  const sirayaAl = () => { if (!kimlik) kimlik = requestAnimationFrame(uygula); };

  function fareHareket(e){
    if (!yeterinceGenis()) return;
    fareK = yatayMi ? e.clientX : e.clientY;
    sirayaAl();
  }
  function fareGirdi(){
    if (!yeterinceGenis()) return;
    olcuAl();
    serit.classList.add('izliyor');
  }
  function fareCikti(){
    serit.classList.remove('izliyor');
    fareK = null;
    sirayaAl();
  }

  function baglantiKur(){
    serit.addEventListener('pointerenter', fareGirdi);
    serit.addEventListener('pointermove',  fareHareket);
    serit.addEventListener('pointerleave', fareCikti);
  }
  function baglantiKes(){
    serit.removeEventListener('pointerenter', fareGirdi);
    serit.removeEventListener('pointermove',  fareHareket);
    serit.removeEventListener('pointerleave', fareCikti);
    fareCikti();
  }

  const uygunMu = () => fareVar.matches && !azHareket.matches;
  if (uygunMu()) baglantiKur();

  const yenidenBak = () => uygunMu() ? baglantiKur() : baglantiKes();
  fareVar.addEventListener   ? fareVar.addEventListener('change', yenidenBak)   : fareVar.addListener(yenidenBak);
  azHareket.addEventListener ? azHareket.addEventListener('change', yenidenBak) : azHareket.addListener(yenidenBak);

  new ResizeObserver(() => { if (serit.classList.contains('izliyor')) olcuAl(); }).observe(serit);
  addEventListener('scroll', () => { if (serit.classList.contains('izliyor')) olcuAl(); }, {passive:true});

  dockListesi.push({
    ad: seritSecici, yon,
    durum: () => ({
      acik: uygunMu(),
      izliyor: serit.classList.contains('izliyor'),
      yakinliklar: hucreler.map(h => Number(getComputedStyle(h).getPropertyValue('--yakinlik')) || 0),
    }),
  });
}

dockKur('.guven',       '.guven-hucre',  'yatay', 1000);
dockKur('.fiyat-tablo', '.fiyat-satir',  'dikey',  860);
dockKur('.surec',       '.adim',         'dikey',  860);

/* hata ayıklama ve test penceresi */
window.dockDurum = (ad) => {
  if (ad) return (dockListesi.find(d => d.ad === ad) || {durum:()=>null}).durum();
  return dockListesi.map(d => ({ad: d.ad, yon: d.yon, ...d.durum()}));
};

/* ---- sık sorulanlar: yumuşak açılma ----
   <details> öğesi kendi başına animasyonlanamıyor: açıldığı an içerik
   birden beliriyor. Bu yüzden açma/kapama elle yönetiliyor ve cevabın
   yüksekliği ölçülüp geçişe bağlanıyor. */
document.querySelectorAll('.fsss details').forEach(kutu => {
  const ozet  = kutu.querySelector('summary');
  const govde = kutu.querySelector('.sss-govde');
  if (!ozet || !govde) return;

  const azHareket = matchMedia('(prefers-reduced-motion: reduce)');
  let animasyon = null;

  function ac(){
    kutu.open = true;
    govde.classList.add('acik');
    if (azHareket.matches){ govde.style.height = 'auto'; return; }
    govde.style.height = '0px';
    requestAnimationFrame(() => { govde.style.height = govde.scrollHeight + 'px'; });
    animasyon = () => { if (kutu.open) govde.style.height = 'auto'; };
    govde.addEventListener('transitionend', animasyon, {once:true});
  }
  function kapat(){
    govde.classList.remove('acik');
    if (azHareket.matches){ govde.style.height = '0px'; kutu.open = false; return; }
    /* 'auto' yükseklikten geçiş yapılamıyor, önce ölçülen değere sabitle */
    govde.style.height = govde.scrollHeight + 'px';
    requestAnimationFrame(() => { govde.style.height = '0px'; });
    animasyon = () => { if (!govde.classList.contains('acik')) kutu.open = false; };
    govde.addEventListener('transitionend', animasyon, {once:true});
  }

  ozet.addEventListener('click', (e) => {
    e.preventDefault();
    if (animasyon){ govde.removeEventListener('transitionend', animasyon); animasyon = null; }
    kutu.open && govde.classList.contains('acik') ? kapat() : ac();
  });

  /* pencere daralınca metin uzuyor, açık cevabın yüksekliği güncellenmeli */
  new ResizeObserver(() => {
    if (kutu.open && govde.classList.contains('acik') && govde.style.height !== 'auto'){
      govde.style.height = 'auto';
    }
  }).observe(govde);
});

/* ---- başlıkta bulunulan bölümü işaretle ----
   Ekranın üst üçte birinde hangi bölüm varsa menüdeki karşılığı beyaza
   dönüp hafifçe parlıyor. Renk değişmiyor, yalnız parlaklık artıyor. */
(function bolumIzle(){
  const baglar = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  if (!baglar.length) return;

  const bolumler = baglar
    .map(a => ({ bag: a, oge: document.querySelector(a.getAttribute('href')) }))
    .filter(x => x.oge);
  if (!bolumler.length) return;

  let sonEtkin = null;
  function bak(){
    const cizgi = innerHeight * 0.34;      /* karar çizgisi: ekranın üst üçte biri */
    let etkin = null;
    for (const b of bolumler){
      const k = b.oge.getBoundingClientRect();
      if (k.top <= cizgi && k.bottom > cizgi) etkin = b.bag;
    }
    /* sayfanın en altındayken son bölüm etkin sayılır */
    if (!etkin && innerHeight + scrollY >= document.body.scrollHeight - 4){
      etkin = bolumler[bolumler.length - 1].bag;
    }
    if (etkin === sonEtkin) return;
    baglar.forEach(a => a.classList.remove('etkin'));
    if (etkin) etkin.classList.add('etkin');
    sonEtkin = etkin;
  }

  let bekliyor = false;
  const sirala = () => {
    if (bekliyor) return;
    bekliyor = true;
    requestAnimationFrame(() => { bekliyor = false; bak(); });
  };
  addEventListener('scroll', sirala, {passive:true});
  addEventListener('resize', sirala, {passive:true});
  bak();

  window.etkinBolum = () => (document.querySelector('.nav-links a.etkin') || {}).textContent || null;
})();

/* ---- iletisim formu ----
   Sunucu yok, o yuzden form gonderimi WhatsApp'a hazir mesaj olarak
   gidiyor. Ziyaretci yaziyor, biz de hicbir sey kaybetmiyoruz. */
const iletForm = document.getElementById('iletForm');
const fAlan = {
  ad:      document.getElementById('ad'),
  ilce:    document.getElementById('ilce'),
  tel:     document.getElementById('tel'),
  ilgi:    document.getElementById('ilgi'),
  mesaj:   document.getElementById('mesaj'),
  kvkk:    document.getElementById('kvkk'),
};

/* telefon maskesi: 0 (5XX) XXX XX XX */
function telBicimle(ham){
  let r = ham.replace(/\D/g,'');
  if (r.startsWith('90')) r = r.slice(2);
  if (r && !r.startsWith('0')) r = '0' + r;
  r = r.slice(0,11);
  if (r.length <= 1) return r;
  let c = r[0] + ' (' + r.slice(1,4);
  if (r.length >= 4) c += ')';
  if (r.length > 4)  c += ' ' + r.slice(4,7);
  if (r.length > 7)  c += ' ' + r.slice(7,9);
  if (r.length > 9)  c += ' ' + r.slice(9,11);
  return c;
}
fAlan.tel.addEventListener('input', e => { e.target.value = telBicimle(e.target.value); });
const telGecerli = v => /^0\s?\(5\d{2}\)\s?\d{3}\s?\d{2}\s?\d{2}$/.test(v.trim());

['ad','tel','ilce'].forEach(k => fAlan[k].addEventListener('input',
  () => document.getElementById('a-'+k).classList.remove('bozuk')));
fAlan.kvkk.addEventListener('change',
  () => document.getElementById('a-kvkk').classList.remove('bozuk'));

iletForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const kontroller = [
    ['a-ad',      !fAlan.ad.value.trim(),       fAlan.ad],
    ['a-tel',     !telGecerli(fAlan.tel.value), fAlan.tel],
    ['a-ilce',    !fAlan.ilce.value.trim(),     fAlan.ilce],
    ['a-kvkk',    !fAlan.kvkk.checked,          fAlan.kvkk],
  ];
  let ilkHata = null;
  kontroller.forEach(([kutu, bozuk, oge]) => {
    document.getElementById(kutu).classList.toggle('bozuk', bozuk);
    if (bozuk && !ilkHata) ilkHata = oge;
  });
  if (ilkHata){ ilkHata.focus(); return; }

  const satirlar = [
    'Merhaba, siteniz üzerinden yazıyorum.',
    '',
    'Ad: '      + fAlan.ad.value.trim(),
    'Telefon: ' + fAlan.tel.value.trim(),
    'İlçe: '    + fAlan.ilce.value.trim(),
    'İlgilendiğim: ' + fAlan.ilgi.value,
  ];
  if (fAlan.mesaj.value.trim()) satirlar.push('', fAlan.mesaj.value.trim());

  const metin  = satirlar.join('\n');
  sonMesaj     = metin;
  const numara = waNumara();

  /* Telefon yapilandirilmamis: formu GIZLEME, bilgileri koru, gercegi soyle. */
  if (!numara){
    formDurum('Şu an WhatsApp bağlantımız kurulu değil. Bilgileriniz formda duruyor; '
      + 'lütfen bize doğrudan yazın, en kısa sürede dönelim.', 'hata');
    return;
  }

  waAdresi = 'https://wa.me/' + numara + '?text=' + encodeURIComponent(metin);

  /* 'noopener' secenegi window.open'i her zaman null dondurur (sartname geregi),
     o yuzden burada kullanilmiyor: acilip acilmadigini anlayabilmemiz gerekiyor.
     Guvenlik icin opener bagi hemen elle kopariliyor. */
  const pencere = window.open(waAdresi, '_blank');
  if (pencere) { try { pencere.opener = null; } catch(_) {} }

  /* Acilir pencere engellendi: basari gosterme, tiklanabilir bag ver. */
  if (!pencere){
    formDurum('Tarayıcınız yeni sekmeyi engelledi. '
      + '<a href="' + waAdresi + '" target="_blank" rel="noopener">WhatsApp\'ı buradan açın</a>.', 'hata');
    return;
  }

  document.getElementById('formDurum')?.remove();
  document.getElementById('waTekrar').href = waAdresi;
  document.getElementById('formAlanlar').style.display = 'none';
  document.getElementById('formTamam').classList.add('gorun');
});

/* ---- basari ekrani yardimcilari ---- */
let sonMesaj = '', waAdresi = '';

function formDurum(html, tur){
  let kutu = document.getElementById('formDurum');
  if (!kutu){
    kutu = document.createElement('div');
    kutu.id = 'formDurum';
    kutu.setAttribute('role', 'status');
    document.getElementById('formAlanlar').appendChild(kutu);
  }
  kutu.className = 'form-durum ' + (tur || '');
  kutu.innerHTML = html;
}

document.addEventListener('click', e => {
  const kopyala = e.target.closest('#mesajKopyala');
  const geri    = e.target.closest('#formaDon');

  if (kopyala && sonMesaj){
    const bitir = (yazi) => {
      kopyala.textContent = yazi;
      setTimeout(() => { kopyala.textContent = 'Mesajı kopyala'; }, 2200);
    };
    navigator.clipboard?.writeText(sonMesaj)
      .then(() => bitir('Kopyalandı'))
      .catch(() => bitir('Kopyalanamadı'));
  }
  if (geri){
    document.getElementById('formTamam').classList.remove('gorun');
    document.getElementById('formAlanlar').style.display = '';
    document.querySelector('#a-ad input')?.focus();
  }
});

/* ---- fiyat tablosu: bilgi balonlari ---- */
const bilgiDugmeleri = [...document.querySelectorAll('.bilgi-dugme')];

/* Telefonda balon alttan acilan panele donusuyor ve arkasina perde geliyor.
   Ama .wrap uzerinde z-index:1 var, bu bir katman baglami yaratiyor:
   balon o baglamin icinde kaldigi surece perde her zaman ustunde kaliyor.
   Cozum: telefonda balonu gecici olarak govdeye tasiyoruz, kapaninca
   kendi yerine geri koyuyoruz. */
const balonYuvasi = new Map();
const TELEFON = () => innerWidth <= 720;

const balonBul = (dugme) => document.getElementById(dugme.getAttribute('aria-controls'));

/* telefonda balonun arkasindaki karartma */
const perde = document.createElement('div');
perde.className = 'bilgi-perde';
document.body.appendChild(perde);

function balonKapat(dugme){
  dugme.setAttribute('aria-expanded','false');
  const balon = balonBul(dugme);
  balon.classList.remove('acik');
  perde.classList.remove('acik');
  document.body.classList.remove('balon-acik');
  if (acikBalon === balon) acikBalon = null;
  setTimeout(() => {
    if (balon.classList.contains('acik')) return;
    balon.classList.remove('hazir');
    balon.style.left = '';
    const yuva = balonYuvasi.get(balon);
    if (yuva){ yuva.appendChild(balon); balonYuvasi.delete(balon); }
  }, 300);
}
function hepsiniKapat(haric){
  bilgiDugmeleri.forEach(d => {
    if (d !== haric && d.getAttribute('aria-expanded') === 'true') balonKapat(d);
  });
}

/* Her balona gorunur bir kapat dugmesi. HTML'e elle yazmak yerine burada
   uretiliyor: bes fiyat satirinda ayni yapi tekrar etmesin. */
document.querySelectorAll('.bilgi-balon').forEach(balon => {
  const kapat = document.createElement('button');
  kapat.type = 'button';
  kapat.className = 'balon-kapat';
  kapat.setAttribute('aria-label', 'Bilgi kutusunu kapat');
  kapat.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    + 'stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  kapat.addEventListener('click', (e) => {
    e.stopPropagation();
    const sahip = bilgiDugmeleri.find(x => x.getAttribute('aria-controls') === balon.id);
    if (sahip){ balonKapat(sahip); sahip.focus(); }
  });
  balon.insertBefore(kapat, balon.firstChild);
});

/* Panel acikken Tab panelin icinde dolasir, disari kacmaz. */
function odakTut(balon, e){
  if (e.key !== 'Tab') return;
  const odaklanabilir = balon.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
  if (!odaklanabilir.length) return;
  const ilk = odaklanabilir[0], son = odaklanabilir[odaklanabilir.length - 1];
  if (e.shiftKey && document.activeElement === ilk){ e.preventDefault(); son.focus(); }
  else if (!e.shiftKey && document.activeElement === son){ e.preventDefault(); ilk.focus(); }
}
let acikBalon = null;
document.addEventListener('keydown', e => { if (acikBalon) odakTut(acikBalon, e); });

bilgiDugmeleri.forEach(dugme => {
  dugme.addEventListener('click', (e) => {
    e.stopPropagation();
    const acik = dugme.getAttribute('aria-expanded') === 'true';
    hepsiniKapat(dugme);
    if (acik){ balonKapat(dugme); return; }

    const balon = balonBul(dugme);
    if (TELEFON() && balon.parentElement !== document.body){
      balonYuvasi.set(balon, balon.parentElement);
      document.body.appendChild(balon);
    }
    dugme.setAttribute('aria-expanded','true');
    balon.classList.add('hazir');
    balon.style.left = TELEFON() ? '' : '-10px';

    /* olculeri alabilmek icin once yerlestir, sonra ac */
    requestAnimationFrame(() => {
      if (!TELEFON()){
        const tasma = balon.getBoundingClientRect().right - (innerWidth - 16);
        if (tasma > 0) balon.style.left = (-10 - tasma) + 'px';
      } else {
        perde.classList.add('acik');
        document.body.classList.add('balon-acik');
      }
      balon.classList.add('acik');
      acikBalon = balon;
      balon.querySelector('.balon-kapat')?.focus();
    });
  });
});

/* balonun icine tiklayinca kapanmasin */
document.querySelectorAll('.bilgi-balon').forEach(b =>
  b.addEventListener('click', e => e.stopPropagation()));

document.addEventListener('click', () => hepsiniKapat(null));
perde.addEventListener('click', () => hepsiniKapat(null));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape'){
    const acik = bilgiDugmeleri.find(d => d.getAttribute('aria-expanded') === 'true');
    if (acik){ balonKapat(acik); acik.focus(); }
  }
});

/* Paket dugmesi: ilgili secimi forma tasir ve oraya kaydirir.
   Musteri fiyat tablosunda begendigi paketi formda tekrar aramasin. */
document.querySelectorAll('.paket-sec').forEach(dugme => {
  dugme.addEventListener('click', (e) => {
    e.stopPropagation();
    const secim = dugme.dataset.secim;
    const alan  = document.getElementById('ilgi');
    if (alan){
      const uygun = [...alan.options].find(o => o.textContent.trim() === secim);
      if (uygun) alan.value = uygun.value || uygun.textContent;
    }
    const hedef = document.getElementById('iletisim');
    if (hedef) yumusakKaydir(hedef, () => document.querySelector('#a-ad input')?.focus());
  });
});

/* Kaydırınca beliren ögeler.
   IntersectionObserver tek başına yetmiyor: hızlı kaydırmada ara durumları
   atlayabiliyor ve öge gizli kalıyor. Bu yüzden ikinci bir güvenlik ağı var,
   kaydırma durduğunda görünür alandaki her şeyi zorla açıyor. */
const girenler = [...document.querySelectorAll('.gir')];

function ac(el){ el.classList.add('ic'); }

const gozcu = new IntersectionObserver((girisler) => {
  girisler.forEach(g => { if (g.isIntersecting){ ac(g.target); gozcu.unobserve(g.target); } });
}, {threshold:0, rootMargin:'0px 0px -6% 0px'});
girenler.forEach(e => gozcu.observe(e));

/* güvenlik ağı: görünür alana girmiş ama hâlâ kapalı kalanı aç */
function kurtar(){
  const yukseklik = innerHeight;
  girenler.forEach(e => {
    if (e.classList.contains('ic')) return;
    const k = e.getBoundingClientRect();
    if (k.top < yukseklik * 0.94 && k.bottom > 0){ ac(e); gozcu.unobserve(e); }
  });
}
let zaman;
addEventListener('scroll', () => { clearTimeout(zaman); zaman = setTimeout(kurtar, 90); }, {passive:true});
addEventListener('resize', kurtar, {passive:true});
addEventListener('load', kurtar);
setTimeout(kurtar, 400);
