const { chromium, webkit } = require('playwright');
const path = require('path');
const ADRES = process.env.ADRES || 'http://127.0.0.1:8791/';
let gecti = 0, kaldi = 0;
const sonuc = (ad, ok, ek) => { ok ? gecti++ : kaldi++; console.log((ok ? 'GEÇTİ ' : 'KALDI ') + ad + (ek ? ' -> ' + ek : '')); };

(async () => {
  for (const [motorAd, motor] of [['chromium', chromium], ['webkit', webkit]]) {
    const tarayici = await motor.launch();
    for (const [ad, en, boy] of [['telefon-SE', 320, 640], ['telefon', 390, 844], ['tablet', 768, 1024], ['masaustu', 1366, 900]]) {
      const sayfa = await tarayici.newPage({ viewport: { width: en, height: boy } });
      const hatalar = [];
      sayfa.on('pageerror', e => hatalar.push(e.message));
      sayfa.on('console', m => { if (m.type() === 'error') hatalar.push(m.text()); });
      await sayfa.goto(ADRES, { waitUntil: 'networkidle' });
      const e = `${motorAd}/${ad}`;
      sonuc(`${e} konsol hatası yok`, hatalar.length === 0, hatalar.join(' | '));
      const tasma = await sayfa.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      sonuc(`${e} yatay taşma 0`, tasma <= 0, tasma + 'px');
      sonuc(`${e} 4 cihaz kartı`, await sayfa.locator('.cihaz').count() === 4);
      sonuc(`${e} 3 bakım paketi`, await sayfa.locator('.paket').count() === 3);
      sonuc(`${e} 6 soru`, await sayfa.locator('.sss details').count() === 6);
      const tel = await sayfa.locator('.yapiskan-ara').getAttribute('href');
      sonuc(`${e} arama bağlantısı doğru`, tel === 'tel:+905312091808', tel);
      const wa = await sayfa.locator('#cihaz-hyundai a.dugme').getAttribute('href');
      sonuc(`${e} WhatsApp mesajında ürün adı`, wa && wa.startsWith('https://wa.me/905312091808?text=') && decodeURIComponent(wa).includes('Hyundai HND-35'), wa);
      const yapiskan = await sayfa.locator('.yapiskan').isVisible();
      sonuc(`${e} alt çubuk ${en < 980 ? 'görünür' : 'gizli'}`, yapiskan === (en < 980));
      const fiyat = await sayfa.locator('#cihaz-lg .fiyat-buyuk').textContent();
      sonuc(`${e} LG peşin fiyat`, fiyat.replace(/\s/g, ' ') === '10.000 TL', fiyat);
      sonuc(`${e} önizleme şeridi görünür`, await sayfa.locator('#onizleme').isVisible());
      sonuc(`${e} boş çalışma saati gizli`, !(await sayfa.locator('#saat-satir').isVisible()));
      const buyuk = await sayfa.evaluate(() => getComputedStyle(document.querySelector('.ust-baslik')).textTransform);
      sonuc(`${e} boş çalışma saati gizli`, !(await sayfa.locator('#saat-satir').isVisible()));
      sonuc(`${e} lang=tr`, await sayfa.evaluate(() => document.documentElement.lang) === 'tr');
      // Taşan öğe var mı (kartların içinden dışarı çıkan metin)
      const tasan = await sayfa.evaluate(() => [...document.querySelectorAll('.cihaz *, .paket *, .pano *, .iletisim-kart *')].filter(n => n.scrollWidth > n.clientWidth + 1 && getComputedStyle(n).overflowX === 'visible' && n.clientWidth > 0).map(n => n.className || n.tagName).slice(0, 5));
      sonuc(`${e} kart içi taşma yok`, tasan.length === 0, tasan.join(','));
      // Font yüklendi mi
      const font = await sayfa.evaluate(async () => { await document.fonts.ready; return document.fonts.check('800 20px Manrope') && document.fonts.check('400 18px "Source Sans 3"'); });
      sonuc(`${e} yazı tipleri yüklendi`, font);
      if (motorAd === 'chromium') await sayfa.screenshot({ path: path.join(__dirname, `../_ekran/${ad}.png`), fullPage: true });
      // SSS açılıyor mu
      await sayfa.locator('.sss summary').first().click();
      sonuc(`${e} soru açılıyor`, await sayfa.locator('.sss details').first().evaluate(d => d.open));
      await sayfa.close();
    }
    // Klavye odağı
    const s = await tarayici.newPage({ viewport: { width: 1366, height: 900 } });
    await s.goto(ADRES);
    await s.keyboard.press('Tab');
    const odak = await s.evaluate(() => document.activeElement.className + ' ' + getComputedStyle(document.activeElement).outlineStyle);
    sonuc(`${motorAd} klavye odağı görünür`, (motorAd === 'webkit' || /marka/.test(odak)) && !/none/.test(odak), odak);
    // Fiyat gizleme ayarı
    await s.route('**/veri.js', async r => { const y = await r.fetch(); let t = await y.text(); t = t.replace('fiyatGoster: true', 'fiyatGoster: false').replace('taslak: true', 'taslak: false'); r.fulfill({ response: y, body: t }); });
    await s.goto(ADRES);
    const gizli = await s.locator('body').textContent();
    sonuc(`${motorAd} fiyat gizleme ayarı çalışıyor`, !/10\.000/.test(gizli) && /Fiyat için arayın/.test(gizli) && !(await s.locator('#onizleme').isVisible()));
    await tarayici.close();
  }
  console.log(`\nSONUÇ: ${gecti} geçti, ${kaldi} kaldı`);
  process.exit(kaldi ? 1 : 0);
})();
