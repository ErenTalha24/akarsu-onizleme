const { chromium, webkit } = require('playwright');
const ADRES = process.env.ADRES || 'http://127.0.0.1:8791/';
let gecti = 0, kaldi = 0;
const sonuc = (ad, ok, ek) => { ok ? gecti++ : kaldi++; console.log((ok ? 'GEÇTİ ' : 'KALDI ') + ad + (ek ? ' -> ' + ek : '')); };
const gpuUyarisi = t => /GL Driver Message|GPU stall/.test(t);

(async () => {
  for (const [motorAd, motor] of [['chromium', chromium], ['webkit', webkit]]) {
    const tarayici = await motor.launch();
    for (const [ad, en, boy] of [['telefon-SE', 320, 640], ['telefon', 390, 844], ['tablet', 768, 1024], ['masaustu', 1366, 900]]) {
      const sayfa = await tarayici.newPage({ viewport: { width: en, height: boy } });
      const hatalar = [];
      sayfa.on('pageerror', e => hatalar.push(e.message));
      sayfa.on('console', m => { if (m.type() === 'error' && !gpuUyarisi(m.text())) hatalar.push(m.text()); });
      await sayfa.goto(ADRES, { waitUntil: 'networkidle' });
      const e = `${motorAd}/${ad}`;
      // bütün sayfayı kaydır ki beliren ögeler açılsın
      await sayfa.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } });
      await sayfa.waitForTimeout(1000);

      sonuc(`${e} konsol hatası yok`, hatalar.length === 0, hatalar.join(' | '));
      const tasma = await sayfa.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      sonuc(`${e} yatay taşma 0`, tasma <= 0, tasma + 'px');
      sonuc(`${e} 4 cihaz satırı`, await sayfa.locator('#cihaz-tablo .fiyat-satir').count() === 4);
      sonuc(`${e} 3 bakım satırı`, await sayfa.locator('#bakim-tablo .fiyat-satir').count() === 3);
      sonuc(`${e} 10 soru`, await sayfa.locator('.fsss details').count() === 10);
      sonuc(`${e} 6 bakım işlemi listelendi`, await sayfa.locator('#bakim-islemleri li').count() === 6);
      const gizli = await sayfa.evaluate(() => document.querySelectorAll('.gir:not(.ic)').length);
      sonuc(`${e} kaydırınca bütün bölümler belirdi`, gizli === 0, gizli + ' gizli');

      const tel = await sayfa.locator('.nav-sag .dugme').getAttribute('href');
      sonuc(`${e} "Hemen arayın" doğru numarayı arar`, tel === 'tel:+905312091808', tel);
      const wa = await sayfa.locator('.kanal[data-marka="wa-link"]').getAttribute('href');
      sonuc(`${e} WhatsApp bağlantısı`, wa && wa.startsWith('https://wa.me/905312091808?text='), wa);
      const lg = (await sayfa.locator('#cihaz-tablo .fiyat-satir').first().locator('.rakam').textContent()).replace(/\s/g, ' ');
      sonuc(`${e} LG peşin fiyat`, lg === '10.000 ₺', lg);
      const kart = await sayfa.locator('#cihaz-tablo .fiyat-satir').nth(1).locator('.yillik').textContent();
      sonuc(`${e} Hyundai kart ve elden taksit`, /14\.500/.test(kart) && /17\.500/.test(kart), kart);
      sonuc(`${e} 7 taslak rozeti`, await sayfa.locator('.taslak-rozet').count() === 7);
      sonuc(`${e} boş çalışma saati gizli`, await sayfa.locator('[data-gerekli="calismaSaatleri"]').count() === 0);
      sonuc(`${e} lang=tr`, await sayfa.evaluate(() => document.documentElement.lang) === 'tr');

      // uzun cihaz adı telefonda sıkışmasın
      const adEn = await sayfa.evaluate(() => Math.round(document.querySelector('#cihaz-tablo .fiyat-satir:nth-child(4) .ad').getBoundingClientRect().width));
      sonuc(`${e} cihaz adı alanı yeterli`, adEn >= 240, adEn + 'px');

      const font = await sayfa.evaluate(async () => { await document.fonts.ready; return document.fonts.check('600 20px Geist') && document.fonts.check('400 12px "Geist Mono"'); });
      sonuc(`${e} yazı tipleri yüklendi`, font);

      // bilgi balonu açılıp kapanıyor
      await sayfa.evaluate(() => scrollTo(0, 0));
      const dugme = sayfa.locator('[aria-controls="bb-hyundai"]');
      await dugme.scrollIntoViewIfNeeded();
      await dugme.click();
      await sayfa.waitForTimeout(450);
      const balonAcik = await sayfa.locator('#bb-hyundai').isVisible();
      const balonMetin = balonAcik ? await sayfa.locator('#bb-hyundai').textContent() : '';
      sonuc(`${e} bilgi balonu açılıyor ve özellik gösteriyor`, balonAcik && /80 GPD/.test(balonMetin));
      await sayfa.keyboard.press('Escape');
      await sayfa.waitForTimeout(400);
      sonuc(`${e} balon Esc ile kapanıyor`, !(await sayfa.locator('#bb-hyundai').evaluate(b => b.classList.contains('acik'))));

      // soru açılıyor
      const ilk = sayfa.locator('.fsss summary').first();
      await ilk.scrollIntoViewIfNeeded(); await ilk.click(); await sayfa.waitForTimeout(450);
      sonuc(`${e} soru cevabı açılıyor`, await sayfa.locator('.fsss details').first().evaluate(d => d.open && d.querySelector('.sss-govde').getBoundingClientRect().height > 20));

      // telefon menüsü
      if (en <= 1000) {
        await sayfa.evaluate(() => scrollTo(0, 0));
        await sayfa.locator('#burger').click();
        sonuc(`${e} telefon menüsü açılıyor`, await sayfa.locator('#mobMenu').isVisible());
      }
      await sayfa.close();
    }

    // "Bu cihazı istiyorum" formu doldurur, form WhatsApp mesajı üretir
    const s = await tarayici.newPage({ viewport: { width: 1366, height: 900 } });
    await s.goto(ADRES, { waitUntil: 'networkidle' });
    await s.locator('#cihaz-tablo .paket-sec').nth(3).click();
    await s.waitForTimeout(1500);
    sonuc(`${motorAd} paket düğmesi formdaki seçimi dolduruyor`, await s.locator('#ilgi').inputValue() === 'RO-Toshiba Ranger Smart');
    await s.locator('#iletForm button[type=submit]').click();
    sonuc(`${motorAd} boş form gönderilmiyor`, await s.locator('#a-ad.bozuk').count() === 1 && await s.locator('#a-kvkk.bozuk').count() === 1);
    await s.fill('#ad', 'Deneme Kişi'); await s.fill('#tel', '05321234567'); await s.fill('#ilce', 'Ümraniye'); await s.check('#kvkk');
    const [pencere] = await Promise.all([s.waitForEvent('popup', { timeout: 5000 }).catch(() => null), s.locator('#iletForm button[type=submit]').click()]);
    const url = pencere ? decodeURIComponent(pencere.url()).replace(/\+/g, ' ') : '';
    sonuc(`${motorAd} form WhatsApp mesajı üretiyor`, /905312091808/.test(url) && /İlçe: Ümraniye/.test(url) && /Ranger Smart/.test(url), url.slice(0, 160));
    if (pencere) await pencere.close();

    // Fiyat gizleme ve taslak ayarı
    await s.route('**/veri.js', async r => { const y = await r.fetch(); let t = await y.text(); t = t.replace('fiyatGoster: true', 'fiyatGoster: false'); r.fulfill({ response: y, body: t }); });
    await s.goto(ADRES, { waitUntil: 'networkidle' });
    const govde = await s.locator('#fiyat').textContent();
    sonuc(`${motorAd} fiyat gizleme ayarı çalışıyor`, !/10\.000/.test(govde) && /Fiyat için arayın/.test(govde) && await s.locator('.taslak-rozet').count() === 0);
    await tarayici.close();
  }
  console.log(`\nSONUÇ: ${gecti} geçti, ${kaldi} kaldı`);
  process.exit(kaldi ? 1 : 0);
})();
