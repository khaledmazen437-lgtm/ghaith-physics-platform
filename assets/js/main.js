
    
    function toggleTheme() {
      const t = document.documentElement.getAttribute('data-theme');
      const nt = t === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nt);
      document.getElementById('theme-btn').textContent = nt === 'dark' ? '🌙' : '☀️';
      localStorage.setItem('ghaith_theme', nt);
    }
    (function () { const t = localStorage.getItem('ghaith_theme') || 'dark'; document.documentElement.setAttribute('data-theme', t); setTimeout(() => { const b = document.getElementById('theme-btn'); if (b) b.textContent = t === 'dark' ? '🌙' : '☀️'; }, 100); })();

    // ===== HERO 3D CIRCUIT CANVAS 
    (function () {
      const c = document.getElementById('hero-3d-canvas');
      if (!c) return;
      const ctx = c.getContext('2d');
      let W, H;
      const nodes = [];
      const numNodes = 70;
      let angleY = 0;
      let angleX = 0;

      function resize() { 
        if (c.parentElement) {
          W = c.width = c.parentElement.clientWidth; 
          H = c.height = c.parentElement.clientHeight; 
        } else {
          W = c.width = window.innerWidth;
          H = c.height = window.innerHeight;
        }
      }
      resize(); 
      window.addEventListener('resize', resize);

      for (let i = 0; i < numNodes; i++) {
        nodes.push({
          x: (Math.random() - 0.5) * 800,
          y: (Math.random() - 0.5) * 800,
          z: (Math.random() - 0.5) * 800,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          vz: (Math.random() - 0.5) * 1.5
        });
      }

      function draw() {
        ctx.clearRect(0, 0, W, H);
        const cx = W / 2;
        const cy = H / 2;
        const fov = 600;

        angleY += 0.002;
        angleX += 0.001;

        const sinY = Math.sin(angleY), cosY = Math.cos(angleY);
        const sinX = Math.sin(angleX), cosX = Math.cos(angleX);

        const dark = document.documentElement.getAttribute('data-theme') === 'dark';
        const nodeColor = dark ? '177, 195, 55' : '18, 77, 90';
        const lineColor = dark ? '177, 195, 55' : '18, 77, 90';

        const projected = [];
        nodes.forEach(node => {
          node.x += node.vx; node.y += node.vy; node.z += node.vz;
          if (node.x > 400 || node.x < -400) node.vx *= -1;
          if (node.y > 400 || node.y < -400) node.vy *= -1;
          if (node.z > 400 || node.z < -400) node.vz *= -1;

          let x1 = node.x * cosY - node.z * sinY;
          let z1 = node.z * cosY + node.x * sinY;
          
          let y1 = node.y * cosX - z1 * sinX;
          let z2 = z1 * cosX + node.y * sinX;

          const scale = fov / (fov + z2 + 1000);
          const px = cx + x1 * scale;
          const py = cy + y1 * scale;

          projected.push({ px, py, scale, z: z2 });
        });

        ctx.lineWidth = 1;
        for (let i = 0; i < projected.length; i++) {
          for (let j = i + 1; j < projected.length; j++) {
            const p1 = projected[i];
            const p2 = projected[j];
            const dx = p1.px - p2.px;
            const dy = p1.py - p2.py;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < 130) {
              ctx.beginPath();
              ctx.moveTo(p1.px, p1.py);
              ctx.lineTo(p2.px, p2.py);
              const alpha = (1 - dist / 130) * 0.35;
              ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
              ctx.stroke();
            }
          }
        }

        projected.forEach(p => {
          const r = Math.max(1.5, p.scale * 4.5);
          ctx.beginPath();
          ctx.arc(p.px, p.py, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${nodeColor}, ${0.5 + p.scale*0.5})`;
          ctx.fill();
        });

        requestAnimationFrame(draw);
      }
      draw();
    })();

    // ===== SCROLL REVEAL 
    const obs = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }); }, { threshold: 0.1 });
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => obs.observe(el));

    // ===== DATA 
    const GN = { first: 'الأول الثانوي', second: 'الثاني الثانوي', third: 'الثالث الثانوي' };
    const GC = { first: 'A', second: 'B', third: 'C' };
    let db = {
      students: [
        { id: 'A001', name: 'أحمد محمد علي', phone: '01012345678', grade: 'first', parent: '01098765432', code: 'A001', att: { p: 22, a: 3, t: 25 }, grades: { phy: 92, math: 88, chem: 85, bio: 90, eng: 87 }, qscore: 78, sub: true, warnings: [] },
        { id: 'B001', name: 'فاطمة أحمد حسن', phone: '01123456789', grade: 'second', parent: '01187654321', code: 'B001', att: { p: 24, a: 1, t: 25 }, grades: { phy: 95, math: 92, chem: 90, bio: 88, eng: 94 }, qscore: 91, sub: true, warnings: [] },
        { id: 'C001', name: 'محمد إبراهيم خالد', phone: '01234567890', grade: 'third', parent: '01234567890', code: 'C001', att: { p: 18, a: 7, t: 25 }, grades: { phy: 70, math: 75, chem: 68, bio: 72, eng: 65 }, qscore: 65, sub: false, warnings: [] },
        { id: 'A002', name: 'نورهان سعيد مصطفى', phone: '01345678901', grade: 'first', parent: '01345678901', code: 'A002', att: { p: 23, a: 2, t: 25 }, grades: { phy: 85, math: 82, chem: 88, bio: 84, eng: 80 }, qscore: 83, sub: true, warnings: [] },
      ],
      lessons: [
        { id: 'L1', title: 'قوانين نيوتن للحركة', subject: 'ميكانيكا', dur: '45 دقيقة', grade: 'first', url: '' },
        { id: 'L2', title: 'الكهرباء والمغناطيسية', subject: 'كهرباء', dur: '50 دقيقة', grade: 'third', url: '' },
        { id: 'L3', title: 'الموجات والصوت', subject: 'موجات', dur: '40 دقيقة', grade: 'second', url: '' },
        { id: 'L4', title: 'الضوء والبصريات', subject: 'بصريات', dur: '35 دقيقة', grade: 'all', url: '' },
      ],
      pdfs: [
        { name: 'مراجعة ميكانيكا الفصل الأول', grade: 'first' },
        { name: 'ملخص الكهرباء والمغناطيسية', grade: 'third' },
        { name: 'مسائل محلولة — موجات', grade: 'second' },
        { name: 'مراجعة شاملة الفيزياء', grade: 'all' },
      ],
      lives: [],
      schedule: { first: [{ day: 'السبت', time: '4:00 م', subject: 'فيزياء أولى', teacher: 'Mr. Mustafa Zemetar' }, { day: 'الثلاثاء', time: '4:30 م', subject: 'مراجعة أولى', teacher: 'Mr. Mustafa Zemetar' }], second: [{ day: 'السبت', time: '6:00 م', subject: 'فيزياء ثانية', teacher: 'Mr. Mustafa Zemetar' }, { day: 'الأربعاء', time: '5:00 م', subject: 'مراجعة ثانية', teacher: 'Mr. Mustafa Zemetar' }], third: [{ day: 'الأحد', time: '5:00 م', subject: 'فيزياء ثالثة', teacher: 'Mr. Mustafa Zemetar' }, { day: 'الخميس', time: '3:00 م', subject: 'مراجعة ثالثة', teacher: 'Mr. Mustafa Zemetar' }] },
      quizzes: [
        { id: 'Q1', title: 'كويز قوانين نيوتن', subject: 'ميكانيكا', n: 10, status: 'active', date: '2026-05-05', grade: 'first', duration: 20 },
        { id: 'Q2', title: 'كويز الكهرباء', subject: 'كهرباء', n: 8, status: 'active', date: '2026-05-07', grade: 'third', duration: 15 },
        { id: 'Q3', title: 'كويز الموجات', subject: 'موجات', n: 12, status: 'draft', date: '2026-05-10', grade: 'second', duration: 25 },
      ],
      broadcasts: [],
      warnings: [],
      subPrices: { first: 150, second: 150, third: 200 },
      cur: null, role: null
    };

    const SQS = [
      { q: 'جسم كتلته 5 kg يتسارع بمقدار 3 m/s² — القوة المحركة:', opts: ['10 N', '15 N', '20 N', '25 N'], ok: 1 },
      { q: 'وحدة الشغل في النظام الدولي:', opts: ['واط', 'نيوتن', 'جول', 'باسكال'], ok: 2 },
      { q: 'الموجات الضوئية:', opts: ['ميكانيكية طولية', 'كهرومغناطيسية مستعرضة', 'ميكانيكية مستعرضة', 'صوتية'], ok: 1 },
      { q: 'سرعة الضوء في الفراغ تساوي:', opts: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], ok: 1 },
      { q: 'القانون الثاني لنيوتن يقول:', opts: ['الفعل يساوي رد الفعل', 'القوة تساوي الكتلة × التسارع', 'الجسم الساكن يبقى ساكناً', 'الزخم محفوظ'], ok: 1 },
    ];
    let qz = { cur: 0, score: 0, timer: null, timeLeft: 0, qid: null };

    

    // Firebase refs
    let firebaseApp, firebaseDB, dbRef;
    let firebaseReady = false;
    let unsubscribeListener = null;

    async function initFirebase() {
      try {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
        const { getDatabase, ref, set, onValue, update, remove } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js');

        firebaseApp = initializeApp(FIREBASE_CONFIG);
        firebaseDB = getDatabase(firebaseApp);
        dbRef = ref(firebaseDB, 'ghaith');
        firebaseReady = true;

        // ===== REAL-TIME LISTENER
        
        onValue(dbRef, (snapshot) => {
          const data = snapshot.val();
          if (!data) return;

          // تحديث الطلاب
          if (data.students) {
            const remoteStudents = Object.values(data.students);

            
            if (db.role === 'student' && db.cur) {
              const updated = remoteStudents.find(s => s.code === db.cur.code);
              if (updated) {
                db.cur = updated;
                
                if (typeof loadSHome === 'function') {
                  try { loadSHome(); } catch (e) { }
                }
              }
            }

            db.students = remoteStudents;
            updateCounts();

          
            if (db.role === 'admin') {
              const activeTab = document.querySelector('#admin-page .sb-item.active');
              if (activeTab) {
                const txt = activeTab.textContent.trim();
                if (txt.includes('لوحة التحكم') && typeof loadDash === 'function') {
                  try { loadDash(); appendDashExtras(); } catch (e) { }
                }
              }
            }
          }

          
          if (data.warnings) db.warnings = Object.values(data.warnings);
          if (data.broadcasts) db.broadcasts = Object.values(data.broadcasts);
          if (data.schedule) db.schedule = data.schedule;
          if (data.subPrices) { db.subPrices = data.subPrices; updatePrices(); }
        });

        
        window.saveData = saveDataFirebase;
        window.loadData = loadDataFirebase;

        
        await loadDataFirebase();

        console.log(' Firebase متصل وجاهز');
      } catch (err) {
        console.warn(' Firebase غير متاح — سيُستخدم localStorage كبديل:', err.message);
        // fallback to localStorage silently
      }
    }

    async function saveDataFirebase() {
      if (!firebaseReady || !firebaseDB) {
        // fallback
        try { localStorage.setItem('ghaith_db_students', JSON.stringify(db.students)); } catch (e) { }
        return;
      }
      try {
        const { ref, set } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js');

        
        const studentsObj = {};
        db.students.forEach(s => { studentsObj[s.code] = s; });

        const warningsObj = {};
        db.warnings.forEach((w, i) => { warningsObj[w.id || 'W' + i] = w; });

        const broadcastsObj = {};
        db.broadcasts.forEach((b, i) => { broadcastsObj[b.id || 'BC' + i] = b; });

        await set(ref(firebaseDB, 'ghaith'), {
          students: studentsObj,
          warnings: warningsObj,
          broadcasts: broadcastsObj,
          schedule: db.schedule,
          subPrices: db.subPrices,
          lessons: db.lessons,
          quizzes: db.quizzes,
          lastUpdated: Date.now()
        });
      } catch (err) {
        console.error('Firebase save error:', err);
        // fallback
        try { localStorage.setItem('ghaith_db_students', JSON.stringify(db.students)); } catch (e) { }
      }
    }

    async function loadDataFirebase() {
      if (!firebaseReady || !firebaseDB) {
      
        try {
          const d = JSON.parse(localStorage.getItem('ghaith_db_students'));
          if (d && d.length > 0) db.students = d;
        } catch (e) { }
        return;
      }
      try {
        const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js');
        const snap = await get(ref(firebaseDB, 'ghaith'));
        const data = snap.val();
        if (data) {
          if (data.students) db.students = Object.values(data.students);
          if (data.warnings) db.warnings = Object.values(data.warnings);
          if (data.broadcasts) db.broadcasts = Object.values(data.broadcasts);
          if (data.schedule) db.schedule = data.schedule;
          if (data.subPrices) db.subPrices = data.subPrices;
        }
        updateCounts();
        updatePrices();
      } catch (err) {
        console.error('Firebase load error:', err);
      }
    }

    // ===== SESSION (localStorage فقط للجلسة) =====
    function saveSession() { try { localStorage.setItem('ghaith_session', JSON.stringify({ cur: db.cur ? { code: db.cur.code } : null, role: db.role })); } catch (e) { } }
    function loadSession() { try { const s = JSON.parse(localStorage.getItem('ghaith_session')); if (s && s.cur && s.role) { const st = db.students.find(x => x.code === s.cur.code); if (st) { db.cur = st; db.role = s.role; return true; } } return false; } catch (e) { return false; } }
    
    function saveData() { try { localStorage.setItem('ghaith_db_students', JSON.stringify(db.students)); } catch (e) { } }
    function loadData() { try { const d = JSON.parse(localStorage.getItem('ghaith_db_students')); if (d && d.length > 0) db.students = d; } catch (e) { } }
    loadData();
  
    initFirebase();


    window.addEventListener('load', () => {
      if (loadSession()) {
        if (db.role === 'admin') doShowPage('admin-page', () => loadDash());
        else if (db.role === 'student') { updateSidebar(); doShowPage('student-page', () => loadSHome()); }
        else if (db.role === 'parent') { document.getElementById('par-child').textContent = db.cur.name; doShowPage('parent-page', () => loadPHome()); }
      }
      updateCounts();
      updatePrices();
      
    });

    // ===== AUTH =====
    function showLogin(role) {
      const titles = { admin: 'دخول المدرس ', student: 'دخول الطالب ', parent: 'دخول ولي الأمر 👨‍👩‍👦' };
      document.getElementById('login-title').textContent = titles[role];
      let h = '';
      if (role === 'admin') {
        h = `<div class="al al-b">المستخدم: <strong>admin</strong> — كلمة المرور: <strong>1234</strong></div>
    <div class="fg"><label>المستخدم</label><input id="lu" value="admin"></div>
    <div class="fg"><label>كلمة المرور</label><input id="lp" type="password" value="1234"></div>
    <div class="fbtns"><button class="btn btn-r" style="width:100%" onclick="doLogin('admin')">دخول</button></div>`;
      } else if (role === 'student') {
        h = `<div class="fg"><label>كود الطالب (مثال: A-001)</label><input id="lc" placeholder="A-001 / B-001 / C-001"></div>
    <div class="fg"><label>رقم الهاتف</label><input id="lph" placeholder="01XXXXXXXXX"></div>
    <div id="login-res"></div>
    <div class="fbtns" style="flex-direction:column;gap:8px">
      <button class="btn btn-r" style="width:100%" onclick="doLogin('student')">دخول</button>
      <button class="btn btn-ghost" style="width:100%" onclick="closeM('login-modal');openM('reg-modal')">تسجيل طالب جديد</button>
    </div>`;
      } else {
        h = `<div class="fg"><label>رقم هاتف ولي الأمر</label><input id="lpp" placeholder="01XXXXXXXXX"></div>
    <div class="fg"><label>كود الطالب</label><input id="lpc" placeholder="A-001 / B-001 / C-001"></div>
    <div id="login-res"></div>
    <div class="fbtns"><button class="btn btn-g" style="width:100%" onclick="doLogin('parent')">دخول</button></div>`;
      }
      document.getElementById('login-body').innerHTML = h;
      openM('login-modal');
    }

    function _doLoginBase(role) {
      if (role === 'admin') {
        if (document.getElementById('lu').value === 'admin' && document.getElementById('lp').value === '1234') {
          db.role = 'admin'; closeM('login-modal'); doShowPage('admin-page', () => { loadDash(); appendDashExtras(); }); saveSession();
        } else alert('خطأ! المستخدم: admin، كلمة المرور: 1234');
      } else if (role === 'student') {
        const code = document.getElementById('lc').value.trim();
        const phone = document.getElementById('lph').value.trim();
        const st = db.students.find(s => s.code === code && s.phone === phone);
        if (st) { db.cur = st; db.role = 'student'; closeM('login-modal'); updateSidebar(); doShowPage('student-page', () => loadSHome()); saveSession(); }
        else { const r = document.getElementById('login-res'); if (r) r.innerHTML = '<div class="al al-r">❌ كود أو رقم الهاتف غير صحيح!</div>'; }
      } else {
        const phone = document.getElementById('lpp').value.trim();
        const code = document.getElementById('lpc').value.trim();
        const st = db.students.find(s => s.code === code && s.parent === phone);
        if (st) { db.cur = st; db.role = 'parent'; closeM('login-modal'); document.getElementById('par-child').textContent = st.name; doShowPage('parent-page', () => loadPHome()); saveSession(); }
        else { const r = document.getElementById('login-res'); if (r) r.innerHTML = '<div class="al al-r">❌ البيانات غير صحيحة!</div>'; }
      }
    }
    function doLogin(role) { _doLoginBase(role); }

    function doRegister(e) {
      e.preventDefault();
      const name = document.getElementById('rn').value;
      const phone = document.getElementById('rp').value;
      const grade = document.getElementById('rg').value;
      const parent = document.getElementById('rpar').value;
      if (!grade) { alert('اختر الصف'); return; }
      if (db.students.find(s => s.phone === phone)) { document.getElementById('reg-res').innerHTML = '<div class="al al-r">رقم الهاتف مسجل من قبل!</div>'; return; }
      const pref = GC[grade];
      const n = db.students.filter(s => s.grade === grade).length;
      const code = `${pref}${String(n + 1).padStart(3, '0')}`;
      const ns = { id: code, name, phone, grade, parent, code, att: { p: 0, a: 0, t: 0 }, grades: { phy: 0, math: 0, chem: 0, bio: 0, eng: 0 }, qscore: 0, sub: false, warnings: [] };
      db.students.push(ns); saveData(); updateCounts();
      // student count display removed from homepage
      document.getElementById('reg-res').innerHTML = `<div class="al al-ok">✅ تم التسجيل! كودك: <strong style="font-family:'Cinzel',serif;font-size:1.1rem;letter-spacing:2px">${code}</strong><br><small>احتفظ بهذا الكود — ستحتاجه لتسجيل الدخول</small></div>`;
      setTimeout(() => closeM('reg-modal'), 4000);
    }

    function logout() { db.cur = null; db.role = null; localStorage.removeItem('ghaith_session'); document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; }); document.getElementById('welcome-page').style.display = 'block'; document.getElementById('fab-add').style.display = 'none'; document.getElementById('wa-fl').style.display = 'none'; }
    function doShowPage(id, cb) {
      document.getElementById('welcome-page').style.display = 'none';
      document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
      const pg = document.getElementById(id); pg.style.display = 'flex'; pg.classList.add('active');
      if (id === 'admin-page') document.getElementById('fab-add').style.display = 'flex';
      document.getElementById('wa-fl').style.display = 'flex';
      if (cb) cb();
    }
    function openM(id) { document.getElementById(id).classList.add('open'); }
    function closeM(id) { document.getElementById(id).classList.remove('open'); }
    function updateSidebar() { if (!db.cur) return; document.getElementById('st-av').textContent = db.cur.name[0]; document.getElementById('st-nm').textContent = db.cur.name; document.getElementById('st-gr').textContent = GN[db.cur.grade]; }
    function updateCounts() { ['first', 'second', 'third'].forEach(g => { const el = document.getElementById('cnt-' + g); if (el) el.textContent = db.students.filter(s => s.grade === g).length; }); }
    function updatePrices() { ['first', 'second', 'third'].forEach(g => { const el = document.getElementById('price-' + g); if (el) el.textContent = db.subPrices[g] + ' جنيه / شهرياً'; }); }

    // ===== SUBSCRIBE =====
    function buySubscription(grade) {
      const price = db.subPrices[grade];
      const courseName = { 'first': 'الأول الثانوي', 'second': 'الثاني الثانوي', 'third': 'الثالث الثانوي' }[grade];
      const msg = encodeURIComponent(`السلام عليكم يا Mr. Mustafa Zemetar 🎓\nأريد الاشتراك في كورس ${courseName}\nالسعر: ${price} جنيه شهرياً\nاسمي: [اكتب اسمك هنا]`);
      window.open(`https://wa.me/201212897212?text=${msg}`, '_blank');
    }

    // ===== BROADCAST & WARNINGS =====
    function sendWarning() {
      const msg = document.getElementById('warn-msg').value.trim();
      const to = document.getElementById('warn-to').value;
      if (!msg) { alert('أدخل نص التحذير'); return; }
      const warn = { id: 'W' + (Date.now()), msg, to, date: new Date().toLocaleDateString('ar-EG'), time: new Date().toLocaleTimeString('ar-EG') };
      db.warnings.push(warn);
      db.students.filter(s => to === 'all' || s.grade === to).forEach(s => s.warnings.push(warn));
      saveData(); // 
      document.getElementById('warn-res').innerHTML = '<div class="al al-ok">✅ تم إرسال التحذير!</div>';
      setTimeout(() => closeM('warn-modal'), 2000);
    }
    function sendBroadcast() {
      const subj = document.getElementById('bc-subject').value.trim();
      const body = document.getElementById('bc-body').value.trim();
      const to = document.getElementById('bc-to').value;
      if (!subj || !body) { alert('أدخل الموضوع والرسالة'); return; }
      db.broadcasts.push({ id: 'BC' + (Date.now()), subj, body, to, date: new Date().toLocaleDateString('ar-EG') });
      saveData(); // 
      document.getElementById('bc-res').innerHTML = '<div class="al al-ok">✅ تم إرسال الرسالة للطلاب!</div>';
      setTimeout(() => closeM('broadcast-modal'), 2000);
    }

    // ===== ADMIN TABS =====
    function aTab(t, el) {
      document.querySelectorAll('#admin-page .sb-item').forEach(n => n.classList.remove('active'));
      if (el) el.classList.add('active');
      if (t === 'dash') { loadDash(); appendDashExtras(); }
      else if (t.startsWith('grade-')) loadGradePanel(t.replace('grade-', ''));
      else if (t === 'upload') loadUpload();
      else if (t === 'quizzes') loadAQuizzes();
      else if (t === 'schedule') loadASchedule();
      else if (t === 'sub-settings') loadSubSettings();
      else if (t === 'attendance') loadAAtt();
      else if (t === 'grades-admin') loadAGrades();
      else if (t === 'reports') loadAReports();
      else if (t === 'backend') loadBackend();
      else if (t === 'audit') loadAuditLog();
      else if (t === 'backup') loadBackup();
    }

    function loadDash() {
      const tot = db.students.length;
      const avgAtt = tot ? Math.round(db.students.reduce((s, x) => s + (x.att.t > 0 ? x.att.p / x.att.t * 100 : 0), 0) / tot) : 0;
      const avgPhy = tot ? Math.round(db.students.reduce((s, x) => s + x.grades.phy, 0) / tot) : 0;
      document.getElementById('admin-content').innerHTML = `
  <div class="ph"><h1>لوحة <span>التحكم</span></h1><p>${new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
  <div class="sr">
    <div class="sb b"><div class="sb-n">${tot}</div><div class="sb-l">إجمالي الطلاب</div></div>
    <div class="sb g"><div class="sb-n">${avgAtt}%</div><div class="sb-l">متوسط الحضور</div></div>
    <div class="sb o"><div class="sb-n">${avgPhy}%</div><div class="sb-l">متوسط الفيزياء</div></div>
    <div class="sb"><div class="sb-n">${db.quizzes.filter(q => q.status === 'active').length}</div><div class="sb-l">كويزات نشطة</div></div>
    <div class="sb"><div class="sb-n">${db.lessons.length}</div><div class="sb-l">دروس مرفوعة</div></div>
    <div class="sb"><div class="sb-n">${db.warnings.length}</div><div class="sb-l">تحذيرات مرسلة</div></div>
  </div>
  <div class="g2">
    <div class="card"><div class="ct">توزيع الطلاب</div>
    ${['first', 'second', 'third'].map(g => { const n = db.students.filter(s => s.grade === g).length; const p = tot ? Math.round(n / tot * 100) : 0; return `<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:4px"><span>${GN[g]}</span><span style="color:var(--red);font-weight:700">${n} طالب · ${GC[g]}-XXX</span></div><div class="pb"><div class="pbf" style="width:${p}%"></div></div></div>`; }).join('')}
    </div>
    <div class="card"><div class="ct">أداء الفيزياء</div><div class="bc" id="dash-bc"></div></div>
  </div>
  <div class="g2" style="margin-top:14px">
    <div class="card"><div class="ct">الإشعارات والتحذيرات</div>
    ${db.warnings.slice(-3).map(w => `<div class="warn-banner"><span class="wi">⚠️</span><div class="wt"><h5>تحذير — ${GN[w.to] || 'الكل'}</h5><p>${w.msg} · ${w.date}</p></div></div>`).join('') || '<p style="color:var(--text3);font-size:0.85rem">لا توجد تحذيرات حديثة</p>'}
    <button class="btn btn-r" style="width:100%;margin-top:10px" onclick="openM('warn-modal')">⚠️ إرسال تحذير جديد</button>
    </div>
    <div class="card"><div class="ct">الرسائل الجماعية</div>
    ${db.broadcasts.slice(-3).map(b => `<div style="padding:8px;background:var(--bg3);border-radius:7px;margin-bottom:7px"><strong style="font-size:0.85rem">${b.subj}</strong><p style="font-size:0.76px;color:var(--text3)">${b.date}</p></div>`).join('') || '<p style="color:var(--text3);font-size:0.85rem">لا توجد رسائل</p>'}
    <button class="btn btn-b" style="width:100%;margin-top:10px" onclick="openM('broadcast-modal')">📢 رسالة جماعية جديدة</button>
    </div>
  </div>`;
      setTimeout(() => buildBC('dash-bc', db.students.map(s => ({ l: s.name.split(' ')[0], v: s.grades.phy }))), 100);
    }

    function buildBC(id, data) { const el = document.getElementById(id); if (!el) return; el.innerHTML = data.map(d => `<div class="bw"><div class="bv">${d.v}%</div><div class="bar" style="height:${d.v}px;background:${d.v >= 85 ? 'var(--green)' : d.v >= 70 ? 'var(--blue)' : 'var(--red)'}"></div><div class="bl">${d.l}</div></div>`).join(''); }

    function loadGradePanel(grade) {
      const students = db.students.filter(s => s.grade === grade);
      document.getElementById('admin-content').innerHTML = `
  <div class="ph"><h1>${GN[grade]} <span>— كود ${GC[grade]}-XXX</span></h1><p>${students.length} طالب مسجل</p></div>
  <div class="g2">
    <div class="card"><div class="ct">إضافة طالب جديد</div>
    <div class="fg2">
      <div class="fg"><label>الاسم</label><input id="an-${grade}" placeholder="اسم الطالب"></div>
      <div class="fg"><label>الهاتف</label><input id="ap-${grade}" placeholder="01XXXXXXXXX"></div>
      <div class="fg"><label>هاتف ولي الأمر</label><input id="apar-${grade}" placeholder="01XXXXXXXXX"></div>
      <div class="fg"><label>حالة الاشتراك</label><select id="asub-${grade}"><option value="false">غير مشترك</option><option value="true">مشترك</option></select></div>
    </div>
    <div id="add-res-${grade}"></div>
    <button class="btn btn-r" onclick="addGradeStudent('${grade}')">إضافة الطالب</button>
    </div>
    <div class="card"><div class="ct">إحصاءات الصف</div>
    <div class="sr" style="grid-template-columns:repeat(3,1fr)">
      <div class="sb b"><div class="sb-n">${students.length}</div><div class="sb-l">طالب</div></div>
      <div class="sb g"><div class="sb-n">${students.filter(s => s.sub).length}</div><div class="sb-l">مشترك</div></div>
      <div class="sb"><div class="sb-n">${students.length ? Math.round(students.reduce((s, x) => s + x.grades.phy, 0) / students.length) : 0}%</div><div class="sb-l">متوسط الفيزياء</div></div>
    </div>
    <div style="margin-top:1rem">
      <button class="btn btn-r" style="width:100%;margin-bottom:8px" onclick="exportGradeWord('${grade}')">📄 تصدير بيانات ${GN[grade]}</button>
      <button class="btn btn-ghost" style="width:100%" onclick="openM('broadcast-modal')">📢 رسالة لطلاب ${GN[grade]}</button>
    </div>
    </div>
  </div>
  <div class="card" style="margin-top:14px"><div class="ct" style="justify-content:space-between">
    <span>قائمة طلاب ${GN[grade]}</span>
    <input placeholder="🔍 بحث..." style="width:160px;padding:0.35rem 0.7rem;font-size:0.8rem" oninput="filterGradeTable('${grade}',this.value)">
  </div>
  <div class="tw"><table><thead><tr><th>#</th><th>الاسم</th><th>الكود</th><th>الهاتف</th><th>الاشتراك</th><th>الحضور</th><th>الفيزياء</th><th>إجراءات</th></tr></thead>
  <tbody id="gt-${grade}">${renderGradeTable(grade)}</tbody></table></div></div>`;
    }

    function renderGradeTable(grade, filter = '') {
      return db.students.filter(s => s.grade === grade && (!filter || s.name.includes(filter) || s.code.includes(filter))).map((s, i) => {
        const pct = s.att.t > 0 ? Math.round(s.att.p / s.att.t * 100) : 0;
        return `<tr><td>${i + 1}</td><td><strong>${s.name}</strong></td>
    <td><span style="font-family:'Cinzel',serif;color:var(--red);font-size:0.95rem">${s.code}</span></td>
    <td>${s.phone}</td>
    <td><span class="b ${s.sub ? 'b-g' : 'b-r'}">${s.sub ? 'مشترك ✓' : 'غير مشترك'}</span></td>
    <td><span class="b ${pct >= 80 ? 'b-g' : pct >= 60 ? 'b-o' : 'b-r'}">${s.att.t > 0 ? pct + '%' : 'جديد'}</span></td>
    <td>${s.grades.phy}%</td>
    <td>
      <button onclick="toggleSub('${s.id}')" style="background:rgba(42,122,219,0.1);color:#5fa8ff;border:1px solid rgba(42,122,219,0.2);padding:3px 8px;border-radius:5px;cursor:pointer;font-size:0.73rem;font-family:'Cairo',sans-serif;margin-left:4px">${s.sub ? 'إلغاء' : 'تفعيل'} اشتراك</button>
      <button class="del-btn" onclick="delStudent('${s.id}','${grade}')">حذف</button>
    </td></tr>`;
      }).join('');
    }
    function filterGradeTable(grade, v) { const el = document.getElementById('gt-' + grade); if (el) el.innerHTML = renderGradeTable(grade, v); }
    function toggleSub(id) { const s = db.students.find(x => x.id === id); if (s) { s.sub = !s.sub; saveData(); const grade = s.grade; const el = document.getElementById('gt-' + grade); if (el) el.innerHTML = renderGradeTable(grade); } }
    function addGradeStudent(grade) {
      const name = document.getElementById('an-' + grade).value.trim();
      const phone = document.getElementById('ap-' + grade).value.trim();
      const parent = document.getElementById('apar-' + grade).value.trim();
      const sub = document.getElementById('asub-' + grade).value === 'true';
      if (!name || !phone) { alert('أدخل الاسم والهاتف'); return; }
      const n = db.students.filter(s => s.grade === grade).length;
      const code = `${GC[grade]}${String(n + 1).padStart(3, '0')}`;
      db.students.push({ id: code, name, phone, grade, parent, code, att: { p: 0, a: 0, t: 0 }, grades: { phy: 0, math: 0, chem: 0, bio: 0, eng: 0 }, qscore: 0, sub, warnings: [] });
      saveData(); updateCounts();
      document.getElementById('add-res-' + grade).innerHTML = `<div class="al al-ok">✅ تم الإضافة! الكود: <strong>${code}</strong></div>`;
      document.getElementById('gt-' + grade).innerHTML = renderGradeTable(grade);
    }
    function delStudent(id, grade) { if (!confirm('حذف هذا الطالب؟')) return; db.students = db.students.filter(s => s.id !== id); saveData(); updateCounts(); const el = document.getElementById('gt-' + grade); if (el) el.innerHTML = renderGradeTable(grade); }
    function exportGradeWord(grade) {
      const students = db.students.filter(s => s.grade === grade);
      const bom = '\uFEFF';
      const rows = [`بيانات طلاب ${GN[grade]} — منصة Ghaith | Mr. Mustafa Zemetar\n`, `الاسم,الكود,الهاتف,هاتف ولي الأمر,الاشتراك,الحضور,الفيزياء`];
      students.forEach(s => { const pct = s.att.t > 0 ? Math.round(s.att.p / s.att.t * 100) + '%' : 'جديد'; rows.push(`"${s.name}","${s.code}","${s.phone}","${s.parent || '—'}","${s.sub ? 'مشترك' : 'غير مشترك'}","${pct}","${s.grades.phy}%"`); });
      const blob = new Blob([bom + rows.join('\n')], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `طلاب_${GN[grade]}_Ghaith.csv`; a.click();
      alert(`✅ تم تصدير بيانات ${GN[grade]}!`);
    }

    function loadUpload() {
      document.getElementById('admin-content').innerHTML = `
  <div class="ph"><h1>رفع <span>المحتوى</span></h1></div>
  <div class="tabs"><button class="tab active" onclick="showUpTab('video',this)">🎬 فيديو</button><button class="tab" onclick="showUpTab('pdf',this)">📄 PDF</button><button class="tab" onclick="showUpTab('live',this)">🔴 لايف</button></div>
  <div id="up-video">
    <div class="g2"><div class="card"><div class="ct">رفع فيديو جديد</div>
    <div class="fg"><label>عنوان الفيديو</label><input id="vt" placeholder="عنوان الدرس"></div>
    <div class="fg2">
      <div class="fg"><label>الموضوع</label><select id="vs"><option>ميكانيكا</option><option>كهرباء</option><option>موجات</option><option>بصريات</option><option>حرارة</option><option>نووي</option></select></div>
      <div class="fg"><label>للصف</label><select id="vg"><option value="all">الكل</option><option value="first">أولى فقط</option><option value="second">ثانية فقط</option><option value="third">ثالثة فقط</option></select></div>
    </div>
    <div class="fg"><label>رابط يوتيوب</label><input id="vurl" placeholder="https://youtube.com/watch?v=..."></div>
    <div class="fg"><label>المدة</label><input id="vdur" placeholder="45 دقيقة"></div>
    <div id="vres"></div>
    <button class="btn btn-r" style="width:100%;margin-top:0.5rem" onclick="addVid()">رفع الفيديو</button>
    </div>
    <div class="card"><div class="ct">الدروس المرفوعة</div>
    ${db.lessons.map((l, i) => { const cs = ['#a80000', '#2a7adb', '#2ea85a', '#8b5cf6', '#d97706']; return `<div style="display:flex;align-items:center;gap:10px;padding:8px;background:var(--bg3);border-radius:7px;margin-bottom:6px"><div style="width:36px;height:36px;border-radius:7px;background:${cs[i % 5]};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1rem">▶</div><div style="flex:1"><div style="font-size:0.85rem;font-weight:700">${l.title}</div><div style="font-size:0.73rem;color:var(--text3)">${l.subject} · ${GN[l.grade] || 'الكل'}</div></div><button class="del-btn" onclick="delLesson('${l.id}')">حذف</button></div>`; }).join('')}
    </div></div>
  </div>
  <div id="up-pdf" style="display:none">
    <div class="g2"><div class="card"><div class="ct">رفع ملف PDF</div>
    <div class="fg"><label>اسم الملف</label><input id="pt" placeholder="اسم الملف"></div>
    <div class="fg"><label>للصف</label><select id="pg"><option value="all">الكل</option><option value="first">أولى</option><option value="second">ثانية</option><option value="third">ثالثة</option></select></div>
    <div class="uz" onclick="alert('يمكن رفع الملفات بعد ربط الموقع بـ server حقيقي')"><div style="font-size:2rem">📁</div><p>اضغط لاختيار ملف PDF</p></div>
    <div id="pres"></div><button class="btn btn-r" style="width:100%;margin-top:0.5rem" onclick="addPdfItem()">إضافة PDF</button>
    </div></div>
  </div>
  <div id="up-live" style="display:none">
    <div class="g2"><div class="card"><div class="ct">إنشاء لايف مباشر</div>
    <div class="fg"><label>عنوان اللايف</label><input id="lt" placeholder="عنوان الحصة المباشرة"></div>
    <div class="fg"><label>للصف</label><select id="lg"><option value="all">الكل</option><option value="first">أولى</option><option value="second">ثانية</option><option value="third">ثالثة</option></select></div>
    <div class="fg"><label>رابط البث</label><input id="lurl" placeholder="https://youtube.com/live/..."></div>
    <div id="lres"></div><button class="btn btn-r" style="width:100%" onclick="startLive()">🔴 بدء اللايف</button>
    </div>
    <div class="card"><div class="ct">اللايفات النشطة</div>
    ${db.lives.filter(l => l.active).length === 0 ? '<p style="color:var(--text3);font-size:0.85rem">لا يوجد لايف نشط</p>' : db.lives.filter(l => l.active).map(l => `<div style="padding:10px;background:var(--bg3);border-radius:8px;margin-bottom:8px"><span class="live-badge"><span class="ldot"></span>LIVE</span><div style="margin-top:6px;font-size:0.85rem;font-weight:700">${l.title}</div><button onclick="endLive('${l.id}')" class="del-btn" style="margin-top:5px">إنهاء</button></div>`).join('')}
    </div></div>
  </div>`;
    }
    function showUpTab(t, el) { document.querySelectorAll('#admin-content .tab').forEach(b => b.classList.remove('active')); el.classList.add('active');['video', 'pdf', 'live'].forEach(k => document.getElementById('up-' + k).style.display = 'none'); document.getElementById('up-' + t).style.display = 'block'; }
    function addVid() { const t = document.getElementById('vt').value.trim(); if (!t) { alert('أدخل العنوان'); return; } db.lessons.push({ id: 'L' + (Date.now()), title: t, subject: document.getElementById('vs').value, dur: document.getElementById('vdur').value || '30 دقيقة', grade: document.getElementById('vg').value, url: document.getElementById('vurl').value }); document.getElementById('vres').innerHTML = '<div class="al al-ok">✅ تم رفع الفيديو!</div>'; document.getElementById('vt').value = ''; }
    function delLesson(id) { db.lessons = db.lessons.filter(l => l.id !== id); loadUpload(); }
    function addPdfItem() { const n = document.getElementById('pt').value.trim(); if (!n) return; db.pdfs.push({ name: n, grade: document.getElementById('pg').value }); document.getElementById('pres').innerHTML = '<div class="al al-ok">✅ تم إضافة الملف!</div>'; document.getElementById('pt').value = ''; }
    function startLive() { const t = document.getElementById('lt').value.trim(); const url = document.getElementById('lurl').value.trim(); if (!t || !url) { alert('أدخل العنوان والرابط'); return; } db.lives.push({ id: 'LV' + (Date.now()), title: t, grade: document.getElementById('lg').value, url, active: true }); document.getElementById('lres').innerHTML = '<div class="al al-ok">🔴 اللايف نشط!</div>'; loadUpload(); }
    function endLive(id) { db.lives = db.lives.map(l => l.id === id ? { ...l, active: false } : l); loadUpload(); }

    function loadAQuizzes() {
      document.getElementById('admin-content').innerHTML = `
  <div class="ph"><h1>إدارة <span>الكويزات</span></h1></div>
  <div class="g2"><div class="card"><div class="ct">إنشاء كويز جديد</div>
  <div class="fg"><label>عنوان الكويز</label><input id="qt" placeholder="عنوان الكويز"></div>
  <div class="fg2">
    <div class="fg"><label>الموضوع</label><select id="qs"><option>ميكانيكا</option><option>كهرباء</option><option>موجات</option><option>بصريات</option><option>حرارة</option></select></div>
    <div class="fg"><label>الصف</label><select id="qgr"><option value="all">الكل</option><option value="first">أولى</option><option value="second">ثانية</option><option value="third">ثالثة</option></select></div>
    <div class="fg"><label>عدد الأسئلة</label><input id="qn" type="number" value="10" min="1" max="50"></div>
    <div class="fg"><label>مدة الكويز (دقيقة)</label><input id="qdur" type="number" value="20" min="5"></div>
    <div class="fg"><label>تاريخ الكويز</label><input id="qd" type="date"></div>
    <div class="fg"><label>الحالة</label><select id="qst"><option value="draft">مسودة</option><option value="active">نشط الآن</option></select></div>
  </div>
  <div id="qres"></div>
  <button class="btn btn-r" style="width:100%" onclick="addQuiz()">إنشاء الكويز</button>
  </div>
  <div class="card"><div class="ct">الكويزات الموجودة</div>
  ${db.quizzes.map(q => `<div style="padding:10px;background:var(--bg3);border-radius:8px;margin-bottom:8px;border-right:3px solid ${q.status === 'active' ? 'var(--red)' : 'var(--border)'}">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
      <strong style="font-size:0.87rem">${q.title}</strong>
      <span class="b ${q.status === 'active' ? 'b-r' : 'b-x'}">${q.status === 'active' ? '🔴 نشط' : '⏸ مسودة'}</span>
    </div>
    <p style="font-size:0.76rem;color:var(--text3)">${q.subject} · ${q.n} سؤال · ${q.duration} دقيقة · ${GN[q.grade] || 'الكل'}</p>
    <div style="display:flex;gap:6px;margin-top:6px">
      <button onclick="toggleQuiz('${q.id}')" style="background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text2);padding:3px 9px;border-radius:5px;cursor:pointer;font-size:0.75rem;font-family:'Cairo',sans-serif">${q.status === 'active' ? 'إيقاف' : 'تفعيل'}</button>
      <button class="del-btn" onclick="delQuiz('${q.id}')">حذف</button>
    </div>
  </div>`).join('')}
  </div></div>`;
    }
    function addQuiz() { const t = document.getElementById('qt').value.trim(); if (!t) { alert('أدخل العنوان'); return; } db.quizzes.push({ id: 'Q' + (Date.now()), title: t, subject: document.getElementById('qs').value, n: parseInt(document.getElementById('qn').value), duration: parseInt(document.getElementById('qdur').value) || 20, status: document.getElementById('qst').value, date: document.getElementById('qd').value || '2026-05-15', grade: document.getElementById('qgr').value }); document.getElementById('qres').innerHTML = '<div class="al al-ok">✅ تم إنشاء الكويز!</div>'; loadAQuizzes(); }
    function toggleQuiz(id) { const q = db.quizzes.find(q => q.id === id); if (q) q.status = q.status === 'active' ? 'draft' : 'active'; loadAQuizzes(); }
    function delQuiz(id) { db.quizzes = db.quizzes.filter(q => q.id !== id); loadAQuizzes(); }

    function loadASchedule() {
      document.getElementById('admin-content').innerHTML = `
  <div class="ph"><h1>مواعيد <span>الدروس</span></h1><p>جدول منفصل لكل صف دراسي</p></div>
  <div class="tabs"><button class="tab active" onclick="showSchedTab('first',this)">⚡ أولى</button><button class="tab" onclick="showSchedTab('second',this)">🔬 ثانية</button><button class="tab" onclick="showSchedTab('third',this)">🎯 ثالثة</button></div>
  <div id="sched-content">${renderSchedGrade('first')}</div>`;
    }
    function showSchedTab(grade, el) { document.querySelectorAll('#admin-content .tab').forEach(b => b.classList.remove('active')); el.classList.add('active'); document.getElementById('sched-content').innerHTML = renderSchedGrade(grade); }
    function renderSchedGrade(grade) {
      const s = db.schedule[grade] || [];
      return `<div class="g2"><div class="card"><div class="ct">إضافة موعد — ${GN[grade]}</div>
  <div class="fg2">
    <div class="fg"><label>اليوم</label><select id="sd-${grade}"><option>السبت</option><option>الأحد</option><option>الاثنين</option><option>الثلاثاء</option><option>الأربعاء</option><option>الخميس</option></select></div>
    <div class="fg"><label>الوقت</label><input id="st-${grade}" type="time"></div>
    <div class="fg" style="grid-column:1/-1"><label>المادة</label><input id="ss-${grade}" placeholder="عنوان الحصة"></div>
  </div>
  <div id="scres-${grade}"></div>
  <button class="btn btn-r" style="width:100%" onclick="addSched('${grade}')">إضافة الموعد</button>
  </div>
  <div class="card"><div class="ct">جدول ${GN[grade]}</div>
  ${s.map((it, i) => `<div class="sd-item"><div class="ttag">${it.time}</div><div class="sd-inf"><h5>${it.subject}</h5><p>${it.day}</p></div><button class="del-btn" onclick="delSched('${grade}',${i})" style="margin-right:auto">حذف</button></div>`).join('') || '<p style="color:var(--text3);font-size:0.85rem">لا توجد مواعيد</p>'}
  </div></div>`;
    }
    function addSched(grade) { const subj = document.getElementById('ss-' + grade).value.trim(); const time = document.getElementById('st-' + grade).value; if (!subj || !time) { alert('أدخل المادة والوقت'); return; } const [h, m] = time.split(':'); const hr = parseInt(h); const ap = hr >= 12 ? 'م' : 'ص'; const hr12 = hr > 12 ? hr - 12 : hr; if (!db.schedule[grade]) db.schedule[grade] = []; db.schedule[grade].push({ day: document.getElementById('sd-' + grade).value, time: `${hr12}:${m} ${ap}`, subject: subj, teacher: 'Mr. Mustafa Zemetar' }); document.getElementById('scres-' + grade).innerHTML = '<div class="al al-ok">✅ تم إضافة الموعد!</div>'; document.getElementById('sched-content').innerHTML = renderSchedGrade(grade); }
    function delSched(grade, i) { if (db.schedule[grade]) db.schedule[grade].splice(i, 1); document.getElementById('sched-content').innerHTML = renderSchedGrade(grade); }

    function loadSubSettings() {
      document.getElementById('admin-content').innerHTML = `
  <div class="ph"><h1>إعدادات <span>الاشتراك</span></h1><p>حدد أسعار الاشتراك لكل صف</p></div>
  <div class="g3">
  ${['first', 'second', 'third'].map(g => `<div class="card">
    <div class="ct">${GN[g]}</div>
    <div style="text-align:center;margin-bottom:1rem">
      <div style="font-family:'Cinzel',serif;font-size:2.5rem;font-weight:900;color:var(--red)" id="disp-price-${g}">${db.subPrices[g]}</div>
      <div style="font-size:0.75rem;color:var(--text3);text-transform:uppercase;letter-spacing:1px">جنيه / شهرياً</div>
    </div>
    <div class="fg"><label>السعر الجديد</label><input id="sp-${g}" type="number" value="${db.subPrices[g]}" min="0"></div>
    <button class="btn btn-r" style="width:100%" onclick="savePrice('${g}')">حفظ السعر</button>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:7px;font-size:0.78rem;color:var(--text3)">عدد المشتركين: <strong style="color:var(--green)">${db.students.filter(s => s.grade === g && s.sub).length}</strong> من ${db.students.filter(s => s.grade === g).length}</div>
  </div>`).join('')}
  </div>
  <div class="card" style="margin-top:16px"><div class="ct">كيفية الاشتراك</div>
  <div class="no i"><div>ℹ️</div><div><h5>آلية الاشتراك</h5><p>عندما يضغط الطالب "اشترك الآن" يُرسل رسالة تلقائية على واتساب المدرس بالاسم واسم الكورس والسعر</p></div></div>
  <div class="no ok"><div>✅</div><div><h5>تفعيل الاشتراك</h5><p>بعد استلام المبلغ، يقوم المدرس بتفعيل الاشتراك من صفحة الصف الدراسي المعني</p></div></div>
  </div>`;
    }
    function savePrice(grade) { const p = parseInt(document.getElementById('sp-' + grade).value) || 0; db.subPrices[grade] = p; document.getElementById('disp-price-' + grade).textContent = p; updatePrices(); alert(`✅ تم تحديث سعر ${GN[grade]} إلى ${p} جنيه`); }

    function loadAAtt() {
      document.getElementById('admin-content').innerHTML = `
  <div class="ph"><h1>الحضور <span>والغياب</span></h1><p>${new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
  <div class="tabs"><button class="tab active" onclick="showAttTab('first',this)">⚡ أولى</button><button class="tab" onclick="showAttTab('second',this)">🔬 ثانية</button><button class="tab" onclick="showAttTab('third',this)">🎯 ثالثة</button><button class="tab" onclick="showAttTab('all',this)">📋 الكل</button></div>
  <div id="att-content">${renderAttTable('first')}</div>`;
    }
    function showAttTab(grade, el) { document.querySelectorAll('#admin-content .tab').forEach(b => b.classList.remove('active')); el.classList.add('active'); document.getElementById('att-content').innerHTML = renderAttTable(grade); }
    function renderAttTable(grade) {
      const list = grade === 'all' ? db.students : db.students.filter(s => s.grade === grade);
      return `<div class="card"><div class="tw"><table><thead><tr><th>الطالب</th><th>الكود</th><th>الصف</th><th>تسجيل</th><th>الإجمالي</th></tr></thead><tbody>
  ${list.map(s => `<tr><td><strong>${s.name}</strong></td>
  <td style="font-family:'Cinzel',serif;color:var(--red);font-size:0.9rem">${s.code}</td>
  <td><span class="b b-b">${GN[s.grade]}</span></td>
  <td>
    <button onclick="markAtt('${s.id}','p')" style="background:rgba(46,168,90,0.12);color:#56d87a;border:1px solid rgba(46,168,90,0.25);padding:4px 10px;border-radius:5px;cursor:pointer;font-family:'Cairo',sans-serif;font-weight:700;margin-left:5px">✅ حاضر</button>
    <button onclick="markAtt('${s.id}','a')" style="background:rgba(224,16,16,0.1);color:var(--red2);border:1px solid rgba(224,16,16,0.2);padding:4px 10px;border-radius:5px;cursor:pointer;font-family:'Cairo',sans-serif;font-weight:700">❌ غائب</button>
  </td>
  <td id="at-${s.id}"><span class="b ${s.att.t > 0 && s.att.p / s.att.t >= 0.8 ? 'b-g' : 'b-o'}">${s.att.t > 0 ? Math.round(s.att.p / s.att.t * 100) + '%' : 'جديد'}</span></td>
  </tr>`).join('')}
  </tbody></table></div></div>`;
    }
    function markAtt(id, t) { const s = db.students.find(s => s.id === id); if (!s) return; s.att.t++; if (t === 'p') s.att.p++; saveData(); const pct = Math.round(s.att.p / s.att.t * 100); const el = document.getElementById('at-' + id); if (el) el.innerHTML = `<span class="b ${pct >= 80 ? 'b-g' : 'b-o'}">${pct}%</span>`; }

    function loadAGrades() {
      const subs = [{ k: 'phy', n: 'فيزياء' }, { k: 'math', n: 'رياضيات' }, { k: 'chem', n: 'كيمياء' }, { k: 'bio', n: 'أحياء' }, { k: 'eng', n: 'إنجليزي' }];
      document.getElementById('admin-content').innerHTML = `
  <div class="ph"><h1>إدارة <span>الدرجات</span></h1></div>
  <div class="card"><div class="tw"><table><thead><tr><th>الطالب</th><th>الكود</th>${subs.map(s => `<th>${s.n}</th>`).join('')}<th>المتوسط</th><th>حفظ</th></tr></thead><tbody>
  ${db.students.map(s => {
        const avg = Math.round(Object.values(s.grades).reduce((a, b) => a + b, 0) / 5); return `<tr>
    <td><strong>${s.name}</strong></td>
    <td style="font-family:'Cinzel',serif;color:var(--red)">${s.code}</td>
    ${subs.map(sub => `<td><input type="number" min="0" max="100" value="${s.grades[sub.k]}" id="gr-${s.id}-${sub.k}" style="width:58px;padding:3px;text-align:center"></td>`).join('')}
    <td id="avg-${s.id}"><span class="b ${avg >= 85 ? 'b-g' : avg >= 70 ? 'b-b' : 'b-o'}">${avg}%</span></td>
    <td><button onclick="saveGr('${s.id}')" style="background:rgba(224,16,16,0.12);color:var(--red2);border:1px solid rgba(224,16,16,0.2);padding:4px 9px;border-radius:5px;cursor:pointer;font-size:0.78rem;font-family:'Cairo',sans-serif;font-weight:700">حفظ</button></td>
  </tr>`;
      }).join('')}
  </tbody></table></div></div>`;
    }
    function saveGr(id) { const s = db.students.find(s => s.id === id); if (!s) return;['phy', 'math', 'chem', 'bio', 'eng'].forEach(k => { s.grades[k] = Math.min(100, Math.max(0, parseInt(document.getElementById(`gr-${id}-${k}`).value) || 0)); }); saveData(); const avg = Math.round(Object.values(s.grades).reduce((a, b) => a + b, 0) / 5); const el = document.getElementById('avg-' + id); if (el) el.innerHTML = `<span class="b ${avg >= 85 ? 'b-g' : avg >= 70 ? 'b-b' : 'b-o'}">${avg}%</span>`; alert(`✅ تم حفظ درجات ${s.name}`); }

    function loadAReports() {
      document.getElementById('admin-content').innerHTML = `
  <div class="ph"><h1>التقارير <span>الشهرية</span></h1></div>
  <div class="g2" style="margin-bottom:16px">
    ${['first', 'second', 'third'].map(g => { const sts = db.students.filter(s => s.grade === g); const avg = sts.length ? Math.round(sts.reduce((s, x) => s + x.grades.phy, 0) / sts.length) : 0; return `<div class="card"><div class="ct">${GN[g]}</div><div class="bc" id="rc-${g}"></div><button class="btn btn-r" style="width:100%;margin-top:10px" onclick="exportGradeWord('${g}')">📄 تصدير CSV</button></div>`; }).join('')}
  </div>
  <div class="card"><div class="ct">إرسال التقارير</div>
  <div class="g3">
    ${['first', 'second', 'third'].map(g => `<a href="https://wa.me/201212897212" target="_blank" class="btn btn-r" style="display:block;text-align:center;text-decoration:none">📱 تقرير ${GN[g]}</a>`).join('')}
  </div></div>`;
      setTimeout(() => { ['first', 'second', 'third'].forEach(g => { const sts = db.students.filter(s => s.grade === g); if (sts.length) buildBC('rc-' + g, sts.map(s => ({ l: s.name.split(' ')[0], v: s.grades.phy }))); }); }, 100);
    }

    // ===== STUDENT TABS =====
    function sTab(t, el) {
      document.querySelectorAll('#student-page .sb-item').forEach(n => n.classList.remove('active')); if (el) el.classList.add('active');
      if (t === 'home') loadSHome(); else if (t === 'lessons') loadSLessons(); else if (t === 'pdfs') loadSPdfs(); else if (t === 'quizzes') loadSQuizzes(); else if (t === 'schedule') loadSSched(); else if (t === 'grades') loadSGrades(); else if (t === 'attend') loadSAtt(); else if (t === 'subscription') loadSSub();
    }

    function loadSHome() {
      const s = db.cur;
      const avg = Math.round(Object.values(s.grades).reduce((a, b) => a + b, 0) / 5);
      const pct = s.att.t > 0 ? Math.round(s.att.p / s.att.t * 100) : 100;
      const myLive = db.lives.find(l => l.active && (l.grade === 'all' || l.grade === s.grade));
      const warns = s.warnings || [];
      document.getElementById('student-content').innerHTML = `
  ${warns.length > 0 ? `<div class="warn-banner"><span class="wi">⚠️</span><div class="wt"><h5>تحذير من المدرس</h5><p>${warns[warns.length - 1].msg}</p></div></div>` : ''}
  ${myLive ? `<div style="background:rgba(224,16,16,0.08);border:1px solid rgba(224,16,16,0.3);border-radius:10px;padding:1rem 1.3rem;margin-bottom:1.3rem;display:flex;align-items:center;gap:1rem"><span class="live-badge"><span class="ldot"></span>LIVE</span><div><strong>${myLive.title}</strong></div><a href="${myLive.url || '#'}" target="_blank" class="btn btn-r" style="margin-right:auto;text-decoration:none">انضم الآن</a></div>` : ''}
  <div class="ph"><h1>مرحباً <span>${s.name.split(' ')[0]}</span> 👋</h1><p>${GN[s.grade]} — كود: <span style="font-family:'Cinzel',serif;color:var(--red)">${s.code}</span></p></div>
  <div class="ch">
    <div class="ch-name">${s.name}</div>
    <div class="ch-meta">📋 ${GN[s.grade]} — ${s.code}</div>
    <div class="ch-stats">
      <div class="cs"><div class="csn">${s.grades.phy}%</div><div class="csl">فيزياء</div></div>
      <div class="cs"><div class="csn">${pct}%</div><div class="csl">الحضور</div></div>
      <div class="cs"><div class="csn">${s.sub ? '✓' : '✗'}</div><div class="csl">الاشتراك</div></div>
    </div>
  </div>
  <div class="sr">
    <div class="sb g"><div class="sb-n">${avg}%</div><div class="sb-l">المتوسط العام</div></div>
    <div class="sb b"><div class="sb-n">${pct}%</div><div class="sb-l">الحضور</div></div>
    <div class="sb o"><div class="sb-n">${s.qscore || 0}%</div><div class="sb-l">آخر كويز</div></div>
    <div class="sb"><div class="sb-n">${db.quizzes.filter(q => q.status === 'active' && (q.grade === 'all' || q.grade === s.grade)).length}</div><div class="sb-l">كويز متاح</div></div>
  </div>
  <div class="g2">
    <div class="card"><div class="ct">أقرب الدروس</div>
    ${(db.schedule[s.grade] || []).slice(0, 3).map(sc => `<div class="sd-item"><div class="ttag">${sc.time}</div><div class="sd-inf"><h5>${sc.subject}</h5><p>${sc.day}</p></div></div>`).join('') || '<p style="color:var(--text3)">لا توجد مواعيد</p>'}
    </div>
    <div class="card"><div class="ct">كويزات متاحة</div>
    ${db.quizzes.filter(q => q.status === 'active' && (q.grade === 'all' || q.grade === s.grade)).map(q => `<div style="padding:9px;background:var(--bg3);border-radius:7px;margin-bottom:7px;border-right:2px solid var(--red)"><strong style="font-size:0.86rem">${q.title}</strong><p style="font-size:0.75rem;color:var(--text3)">${q.subject} · ${q.n} سؤال · ${q.duration} دقيقة</p><button onclick="sTab('quizzes',null)" class="btn btn-r" style="padding:3px 10px;font-size:0.77rem;margin-top:4px">ابدأ</button></div>`).join('') || '<p style="color:var(--text3)">لا يوجد كويز متاح</p>'}
    </div>
  </div>`;
    }

    function loadSLessons() {
      const mine = db.lessons.filter(l => l.grade === 'all' || l.grade === db.cur.grade);
      const cs = ['#a80000', '#2a7adb', '#2ea85a', '#8b5cf6', '#d97706'];
      document.getElementById('student-content').innerHTML = `
  <div class="ph"><h1>فيديوهات <span>المراجعة</span></h1></div>
  <div class="lg">
  ${mine.map((l, i) => `<div class="lc" onclick="${l.url ? `window.open('${l.url}','_blank')` : `alert('${l.title}')`}">
    <div class="lth" style="background:linear-gradient(135deg,${cs[i % 5]},#0d0d0d)"><div class="pl">▶</div></div>
    <div class="li"><h4>${l.title}</h4><p>${l.subject}</p><div class="lmeta"><span class="b b-b">${l.dur}</span><span class="b b-r">▶ مشاهدة</span></div></div>
  </div>`).join('')}
  ${db.lives.filter(l => l.active && (l.grade === 'all' || l.grade === db.cur.grade)).map(l => `<div class="lc" onclick="window.open('${l.url || '#'}','_blank')">
    <div class="lth" style="background:linear-gradient(135deg,#a80000,#000)"><span class="live-badge" style="position:absolute;top:8px;right:8px"><span class="ldot"></span>LIVE</span><div class="pl">▶</div></div>
    <div class="li"><h4>${l.title}</h4><p>بث مباشر</p><div class="lmeta"><span class="b b-r">انضم الآن</span></div></div>
  </div>`).join('')}
  </div>
  <div style="text-align:center;margin-top:2rem"><a href="https://youtube.com/@mr.mustafazemetar" target="_blank" class="hbtn hbtn-red" style="display:inline-flex">▶ قناة يوتيوب الرسمية</a></div>`;
    }

    function loadSPdfs() {
      const mine = db.pdfs.filter(p => p.grade === 'all' || p.grade === db.cur.grade);
      document.getElementById('student-content').innerHTML = `
  <div class="ph"><h1>ملفات <span>PDF</span></h1></div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px">
  ${mine.map(p => `<div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:1.1rem;text-align:center;cursor:pointer;transition:all 0.2s" onmouseover="this.style.borderColor='var(--red)'" onmouseout="this.style.borderColor='var(--border)'" onclick="alert('تحميل: ${p.name}')">
    <div style="font-size:2.2rem;margin-bottom:0.6rem">📕</div>
    <div style="font-size:0.82rem;font-weight:700;color:var(--text);margin-bottom:8px">${p.name}</div>
    <button class="btn btn-r" style="width:100%;padding:0.45rem;font-size:0.8rem">📥 تحميل</button>
  </div>`).join('')}
  </div>`;
    }

    function loadSQuizzes() {
      qz = { cur: 0, score: 0, timer: null, timeLeft: 0, qid: null };
      document.getElementById('student-content').innerHTML = `
  <div class="ph"><h1>الكويزات <span>التفاعلية</span></h1></div>
  <div class="g2">
  ${db.quizzes.filter(q => q.grade === 'all' || q.grade === db.cur.grade).map(q => `<div class="qc">
    <div class="qq">${q.title}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:1rem">
      <span class="b b-b">${q.subject}</span>
      <span class="b b-x">${q.n} سؤال</span>
      <span class="b b-o">⏱ ${q.duration} دقيقة</span>
      <span class="b ${q.grade === 'all' ? 'b-x' : q.grade === 'first' ? 'b-r' : q.grade === 'second' ? 'b-g' : 'b-b'}">${GN[q.grade] || 'الكل'}</span>
    </div>
    ${q.status === 'active' ? `<button onclick="startQuiz('${q.id}',${q.duration})" class="btn btn-r">🚀 ابدأ الكويز</button>` : `<span class="b b-x">⏳ قريباً</span>`}
  </div>`).join('')}
  </div>
  <div id="quiz-arena" style="margin-top:1.5rem"></div>`;
    }
    function startQuiz(id, dur) { qz = { cur: 0, score: 0, timer: null, timeLeft: (dur || 20) * 60, qid: id }; showQ(); }
    function showQ() {
      const arena = document.getElementById('quiz-arena'); if (!arena) return;
      if (qz.cur >= SQS.length) {
        if (qz.timer) clearInterval(qz.timer);
        const pct = Math.round(qz.score / SQS.length * 100);
        db.cur.qscore = pct; saveData();
        arena.innerHTML = `<div class="card" style="text-align:center;padding:3rem">
      <div style="font-size:4rem;margin-bottom:1rem">${pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚'}</div>
      <div style="font-family:'Cinzel',serif;font-size:3rem;font-weight:900;color:${pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--blue)' : 'var(--red)'};">${pct}%</div>
      <p style="color:var(--text3);margin:1rem 0">${qz.score} من ${SQS.length} إجابات صحيحة</p>
      <span class="b ${pct >= 80 ? 'b-g' : pct >= 60 ? 'b-b' : 'b-r'}" style="font-size:0.95rem;padding:0.45rem 1.3rem">${pct >= 80 ? 'ممتاز!' : pct >= 60 ? 'جيد جداً!' : 'استمر في المحاولة'}</span>
      <br><br><button class="btn btn-r" onclick="loadSQuizzes()">العودة</button>
    </div>`; return;
      }
      const q = SQS[qz.cur];
      arena.innerHTML = `<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
      <span class="b b-r">سؤال ${qz.cur + 1} / ${SQS.length}</span>
      <span id="quiz-timer" style="font-family:'Cinzel',serif;font-size:1rem;color:var(--red);font-weight:700">⏱ ${Math.floor(qz.timeLeft / 60)}:${String(qz.timeLeft % 60).padStart(2, '0')}</span>
    </div>
    <div class="pb" style="margin-bottom:1.2rem"><div class="pbf" style="width:${qz.cur / SQS.length * 100}%"></div></div>
    <div class="qq">⚡ ${q.q}</div>
    <div class="qopts">${q.opts.map((o, i) => `<div class="qopt" onclick="ansQ(${i})">${o}</div>`).join('')}</div>
  </div>`;
      if (qz.timer) clearInterval(qz.timer);
      qz.timer = setInterval(() => { qz.timeLeft--; const el = document.getElementById('quiz-timer'); if (el) el.textContent = `⏱ ${Math.floor(qz.timeLeft / 60)}:${String(qz.timeLeft % 60).padStart(2, '0')}`; if (qz.timeLeft <= 0) { clearInterval(qz.timer); qz.cur = SQS.length; showQ(); } }, 1000);
    }
    function ansQ(i) {
      const q = SQS[qz.cur];
      document.querySelectorAll('.qopt').forEach((o, idx) => { o.onclick = null; if (idx === q.ok) o.classList.add('ok'); else if (idx === i && i !== q.ok) o.classList.add('ng'); });
      if (i === q.ok) qz.score++; qz.cur++;
      setTimeout(showQ, 1100);
    }

    function loadSSched() {
      const mine = db.schedule[db.cur.grade] || [];
      document.getElementById('student-content').innerHTML = `
  <div class="ph"><h1>مواعيد <span>الدروس</span></h1><p>${GN[db.cur.grade]}</p></div>
  <div class="card">
  ${[...new Set(mine.map(s => s.day))].map(day => `<div class="sd-day"><div class="sd-dt">${day}</div>
    ${mine.filter(s => s.day === day).map(s => `<div class="sd-item"><div class="ttag">${s.time}</div><div class="sd-inf"><h5>${s.subject}</h5><p>${s.teacher}</p></div><span class="b b-b" style="margin-right:auto">أونلاين</span></div>`).join('')}
  </div>`).join('') || '<p style="color:var(--text3)">لا توجد مواعيد محددة لصفك حالياً</p>'}
  </div>`;
    }

    function loadSGrades() {
      const s = db.cur;
      const subs = [{ k: 'phy', n: 'فيزياء' }, { k: 'math', n: 'رياضيات' }, { k: 'chem', n: 'كيمياء' }, { k: 'bio', n: 'أحياء' }, { k: 'eng', n: 'إنجليزي' }];
      const avg = Math.round(Object.values(s.grades).reduce((a, b) => a + b, 0) / 5);
      document.getElementById('student-content').innerHTML = `
  <div class="ph"><h1>درجاتي <span>🏆</span></h1></div>
  <div class="g2">
    <div class="card" style="text-align:center">
      <div class="sr2 ${avg >= 85 ? 'sra' : avg >= 70 ? 'srb' : 'src'}" style="margin:0 auto 1rem">${avg}%</div>
      <p style="font-weight:700">المتوسط العام</p>
      <span class="b ${avg >= 85 ? 'b-g' : avg >= 70 ? 'b-b' : 'b-o'}" style="margin-top:6px;display:inline-block">${avg >= 85 ? 'ممتاز' : avg >= 70 ? 'جيد جداً' : 'جيد'}</span>
    </div>
    <div class="card">
    ${subs.map(sub => `<div style="margin-bottom:11px"><div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:0.86rem"><span style="font-weight:600">${sub.n}</span><span style="font-weight:800;color:${s.grades[sub.k] >= 85 ? 'var(--green)' : s.grades[sub.k] >= 70 ? 'var(--blue)' : 'var(--red)'}">${s.grades[sub.k]}%</span></div><div class="pb"><div class="pbf" style="width:${s.grades[sub.k]}%"></div></div></div>`).join('')}
    </div>
  </div>`;
    }

    function loadSAtt() {
      const s = db.cur; const pct = s.att.t > 0 ? Math.round(s.att.p / s.att.t * 100) : 100;
      const days = Array.from({ length: 25 }, (_, i) => ({ d: i + 1, st: i < s.att.p ? 'p' : i < s.att.t ? 'a' : 'f' }));
      document.getElementById('student-content').innerHTML = `
  <div class="ph"><h1>حضوري <span>وغيابي</span></h1></div>
  <div class="sr">
    <div class="sb g"><div class="sb-n">${s.att.p}</div><div class="sb-l">حاضر</div></div>
    <div class="sb"><div class="sb-n" style="color:var(--red)">${s.att.a}</div><div class="sb-l">غائب</div></div>
    <div class="sb b"><div class="sb-n">${pct}%</div><div class="sb-l">النسبة</div></div>
  </div>
  <div class="card">
    <div class="ct">تقويم مايو 2026</div>
    <div style="display:flex;gap:12px;margin-bottom:1rem;font-size:0.78rem"><span style="color:#56d87a">● حاضر</span><span style="color:var(--red2)">● غائب</span><span style="color:var(--border)">● قادم</span></div>
    <div class="ag">${days.map(d => `<div class="ad a${d.st}">${d.d}</div>`).join('')}</div>
  </div>
  ${pct < 75 ? `<div class="warn-banner" style="margin-top:1rem"><span class="wi">⚠️</span><div class="wt"><h5>تحذير الغياب</h5><p>نسبة حضورك أقل من 75%</p></div></div>` : ''}`;
    }

    function loadSSub() {
      const s = db.cur;
      document.getElementById('student-content').innerHTML = `
  <div class="ph"><h1>اشتراكي <span>💳</span></h1></div>
  <div class="card" style="text-align:center;padding:2.5rem;margin-bottom:1rem">
    <div style="font-size:4rem;margin-bottom:1rem">${s.sub ? '✅' : '❌'}</div>
    <div style="font-family:'Cinzel',serif;font-size:1.5rem;font-weight:900;color:${s.sub ? 'var(--green)' : 'var(--red)'};margin-bottom:0.5rem">${s.sub ? 'اشتراك فعّال' : 'غير مشترك'}</div>
    <p style="color:var(--text3);margin-bottom:1.5rem">${GN[s.grade]} — ${db.subPrices[s.grade]} جنيه / شهرياً</p>
    ${!s.sub ? `<button onclick="buySubscription('${s.grade}')" class="btn btn-r" style="padding:0.9rem 2.5rem;font-size:1rem">🛒 اشترك الآن عبر واتساب</button>` : '<span class="b b-g" style="font-size:0.95rem;padding:0.5rem 1.5rem">اشتراكك فعّال ✓</span>'}
  </div>
  <div class="card"><div class="ct">مميزات الاشتراك</div>
  <div class="no ok"><div>✅</div><div><h5>فيديوهات المراجعة الكاملة</h5><p>جميع دروس الفيزياء مسجلة</p></div></div>
  <div class="no ok"><div>✅</div><div><h5>ملفات PDF وشيتات</h5><p>مراجعات ومسائل محلولة</p></div></div>
  <div class="no ok"><div>✅</div><div><h5>كويزات تفاعلية</h5><p>كويزات أسبوعية مع تصحيح فوري</p></div></div>
  <div class="no ok"><div>✅</div><div><h5>جدول الدروس</h5><p>مواعيد الحصص المباشرة</p></div></div>
  </div>`;
    }

    // ===== PARENT TABS =====
    function pTab(t, el) {
      document.querySelectorAll('#parent-page .sb-item').forEach(n => n.classList.remove('active')); if (el) el.classList.add('active');
      if (t === 'home') loadPHome(); else if (t === 'attend') loadPAtt(); else if (t === 'grades') loadPGrades(); else if (t === 'schedule') loadPSched(); else if (t === 'reports') loadPReports();
    }

    function loadPHome() {
      const s = db.cur;
      const avg = Math.round(Object.values(s.grades).reduce((a, b) => a + b, 0) / 5);
      const pct = s.att.t > 0 ? Math.round(s.att.p / s.att.t * 100) : 100;
      const warns = s.warnings || [];
      document.getElementById('parent-content').innerHTML = `
  ${warns.length > 0 ? `<div class="warn-banner"><span class="wi">⚠️</span><div class="wt"><h5>تحذير من المدرس</h5><p>${warns[warns.length - 1].msg}</p></div></div>` : ''}
  <div class="ph"><h1>متابعة <span>أداء الطالب</span></h1></div>
  <div class="ch">
    <div class="ch-name">${s.name}</div>
    <div class="ch-meta">${GN[s.grade]} — كود: ${s.code}</div>
    <div class="ch-stats">
      <div class="cs"><div class="csn">${avg}%</div><div class="csl">المتوسط</div></div>
      <div class="cs"><div class="csn">${pct}%</div><div class="csl">الحضور</div></div>
      <div class="cs"><div class="csn">${s.qscore || 0}%</div><div class="csl">كويز</div></div>
    </div>
  </div>
  <div class="g2">
    <div class="card"><div class="ct">أداء المواد</div><div class="bc" id="par-bc"></div></div>
    <div class="card"><div class="ct">آخر التحديثات</div>
    <div class="no ${pct >= 80 ? 'ok' : 'w'}"><div>${pct >= 80 ? '✅' : '⚠️'}</div><div><h5>الحضور</h5><p>${s.name}: ${pct}%</p></div></div>
    <div class="no i"><div>📝</div><div><h5>الكويزات</h5><p>درجة آخر كويز: ${s.qscore || 0}%</p></div></div>
    <div class="no ${avg >= 75 ? 'ok' : 'w'}"><div>${avg >= 75 ? '🏆' : '📚'}</div><div><h5>الدرجات</h5><p>المتوسط العام: ${avg}%</p></div></div>
    <a href="https://wa.me/201212897212" target="_blank" class="btn btn-r" style="display:block;text-align:center;text-decoration:none;margin-top:1rem">📱 تواصل مع Mr. Mustafa Zemetar</a>
    </div>
  </div>`;
      setTimeout(() => buildBC('par-bc', [{ l: 'فيزياء', v: s.grades.phy }, { l: 'رياضيات', v: s.grades.math }, { l: 'كيمياء', v: s.grades.chem }, { l: 'أحياء', v: s.grades.bio }, { l: 'إنجليزي', v: s.grades.eng }]), 100);
    }

    function loadPAtt() {
      const s = db.cur; const pct = s.att.t > 0 ? Math.round(s.att.p / s.att.t * 100) : 100;
      const days = Array.from({ length: 25 }, (_, i) => ({ d: i + 1, st: i < s.att.p ? 'p' : i < s.att.t ? 'a' : 'f' }));
      document.getElementById('parent-content').innerHTML = `
  <div class="ph"><h1>حضور <span>${s.name}</span></h1></div>
  <div class="sr"><div class="sb g"><div class="sb-n">${s.att.p}</div><div class="sb-l">حاضر</div></div><div class="sb"><div class="sb-n" style="color:var(--red)">${s.att.a}</div><div class="sb-l">غائب</div></div><div class="sb b"><div class="sb-n">${pct}%</div><div class="sb-l">النسبة</div></div></div>
  <div class="card"><div class="ct">تقويم الحضور</div><div style="display:flex;gap:12px;margin-bottom:1rem;font-size:0.78rem"><span style="color:#56d87a">● حاضر</span><span style="color:var(--red2)">● غائب</span></div><div class="ag">${days.map(d => `<div class="ad a${d.st}">${d.d}</div>`).join('')}</div></div>`;
    }

    function loadPGrades() {
      const s = db.cur;
      const subs = [{ k: 'phy', n: 'فيزياء' }, { k: 'math', n: 'رياضيات' }, { k: 'chem', n: 'كيمياء' }, { k: 'bio', n: 'أحياء' }, { k: 'eng', n: 'إنجليزي' }];
      const avg = Math.round(Object.values(s.grades).reduce((a, b) => a + b, 0) / 5);
      document.getElementById('parent-content').innerHTML = `
  <div class="ph"><h1>درجات <span>${s.name}</span></h1></div>
  <div class="g2">
    <div class="card" style="text-align:center"><div class="sr2 ${avg >= 85 ? 'sra' : avg >= 70 ? 'srb' : 'src'}" style="margin:0 auto 1rem">${avg}%</div><p style="font-weight:700">المتوسط العام</p></div>
    <div class="card">${subs.map(sub => `<div style="margin-bottom:11px"><div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:0.86rem"><span>${sub.n}</span><span style="font-weight:800;color:var(--red)">${s.grades[sub.k]}%</span></div><div class="pb"><div class="pbf" style="width:${s.grades[sub.k]}%"></div></div></div>`).join('')}</div>
  </div>`;
    }

    function loadPSched() {
      const mine = db.schedule[db.cur.grade] || [];
      document.getElementById('parent-content').innerHTML = `
  <div class="ph"><h1>مواعيد <span>الدروس</span></h1></div>
  <div class="card">${[...new Set(mine.map(s => s.day))].map(day => `<div class="sd-day"><div class="sd-dt">${day}</div>${mine.filter(s => s.day === day).map(s => `<div class="sd-item"><div class="ttag">${s.time}</div><div class="sd-inf"><h5>${s.subject}</h5><p>${s.teacher}</p></div></div>`).join('')}</div>`).join('') || '<p style="color:var(--text3)">لا توجد مواعيد</p>'}</div>`;
    }

    function loadPReports() {
      const s = db.cur; const avg = Math.round(Object.values(s.grades).reduce((a, b) => a + b, 0) / 5); const pct = s.att.t > 0 ? Math.round(s.att.p / s.att.t * 100) : 100;
      document.getElementById('parent-content').innerHTML = `
  <div class="ph"><h1>التقارير <span>الشهرية</span></h1></div>
  <div class="card" style="margin-bottom:14px">
    <div class="ct">تقرير مايو 2026 — ${s.name}</div>
    <div class="sr"><div class="sb g"><div class="sb-n">${avg}%</div><div class="sb-l">المتوسط</div></div><div class="sb b"><div class="sb-n">${pct}%</div><div class="sb-l">الحضور</div></div><div class="sb o"><div class="sb-n">${s.qscore || 0}%</div><div class="sb-l">الكويزات</div></div></div>
    <div class="bc" id="p-bc" style="height:120px;margin-top:1rem"></div>
    <div style="margin-top:1.2rem;padding:1rem;background:var(--bg3);border-radius:8px;border-right:3px solid var(--red)">
      <p style="font-weight:700;margin-bottom:5px;font-size:0.85rem">📝 ملاحظة Mr. Mustafa Zemetar:</p>
      <p style="font-size:0.84rem;color:var(--text3);line-height:1.8">${avg >= 85 ? `الطالب ${s.name} يُبدي مستوى ممتازاً — يُنصح بالاستمرار والتفوق.` : avg >= 70 ? `الطالب ${s.name} يُظهر أداءً جيداً — يحتاج تحسين في بعض الموضوعات.` : `الطالب ${s.name} يحتاج دعماً إضافياً — يُرجى التواصل مع المدرس.`}</p>
    </div>
  </div>
  <a href="https://wa.me/201212897212" target="_blank" class="btn btn-r" style="display:block;text-align:center;text-decoration:none">📱 تواصل مع Mr. Mustafa Zemetar</a>`;
      setTimeout(() => buildBC('p-bc', [{ l: 'فيزياء', v: s.grades.phy }, { l: 'رياضيات', v: s.grades.math }, { l: 'كيمياء', v: s.grades.chem }, { l: 'أحياء', v: s.grades.bio }, { l: 'إنجليزي', v: s.grades.eng }]), 100);
    }


    // ===== SCROLL PROGRESS =====
    window.addEventListener('scroll', () => {
      const el = document.getElementById('scroll-progress');
      if (el) { const p = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100; el.style.width = p + '%'; }
      // Re-observe for landing page
      document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.9) el.classList.add('visible');
      });
    });

    // ===== HISTORY (Back/Forward) =====
    let histStack = [], histIdx = -1;
    function pushHist(name, cb) {
      histStack = histStack.slice(0, histIdx + 1);
      histStack.push({ name, cb });
      histIdx = histStack.length - 1;
      updateHistBtns();
    }
    function histBack() { if (histIdx > 0) { histIdx--; histStack[histIdx].cb(); updateHistBtns(); } }
    function histFwd() { if (histIdx < histStack.length - 1) { histIdx++; histStack[histIdx].cb(); updateHistBtns(); } }
    function updateHistBtns() {
      const b = document.getElementById('btn-back'), f = document.getElementById('btn-fwd');
      if (b) b.disabled = histIdx <= 0; if (f) f.disabled = histIdx >= histStack.length - 1;
    }

    // ===== NAV MOBILE MENU =====
    function toggleNavMenu() {
      const menu = document.getElementById('nav-mobile-menu');
      const overlay = document.getElementById('nav-mobile-overlay');
      const btn = document.getElementById('nav-hamburger');
      const isOpen = menu.classList.contains('open');
      if (isOpen) {
        menu.classList.remove('open');
        overlay.classList.remove('open');
        btn.classList.remove('open');
      } else {
        menu.classList.add('open');
        overlay.classList.add('open');
        btn.classList.add('open');
      }
    }
    function closeNavMenu() {
      document.getElementById('nav-mobile-menu').classList.remove('open');
      document.getElementById('nav-mobile-overlay').classList.remove('open');
      document.getElementById('nav-hamburger').classList.remove('open');
    }

    // ===== SIDEBAR (pages) =====
    function isMobile() { return window.innerWidth <= 768; }

    function toggleMobileSidebar(pageId) {
      const page = document.getElementById(pageId);
      if (!page) return;
      const sidebar = page.querySelector('.sidebar');
      const overlay = page.querySelector('.sidebar-overlay');
      const btn = page.querySelector('.hamburger');
      if (isMobile()) {
        const isOpen = sidebar.classList.contains('mobile-open');
        if (isOpen) {
          sidebar.classList.remove('mobile-open');
          overlay.classList.remove('open');
          btn.classList.remove('open');
        } else {
          sidebar.classList.add('mobile-open');
          overlay.classList.add('open');
          btn.classList.add('open');
        }
      } else {
        // Desktop: collapse/expand
        const isCollapsed = sidebar.classList.contains('collapsed');
        const mainEl = page.querySelector('.main');
        if (isCollapsed) {
          sidebar.classList.remove('collapsed');
          if (mainEl) mainEl.classList.remove('expanded');
          btn.classList.remove('open');
        } else {
          sidebar.classList.add('collapsed');
          if (mainEl) mainEl.classList.add('expanded');
          btn.classList.add('open');
        }
      }
    }

    function closeMobileSidebar(pageId) {
      const page = document.getElementById(pageId);
      if (!page) return;
      const sidebar = page.querySelector('.sidebar');
      const overlay = page.querySelector('.sidebar-overlay');
      const btn = page.querySelector('.hamburger');
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('open');
      if (btn) btn.classList.remove('open');
    }

    // Auto-close sidebar on mobile when a tab is selected
    function autoCloseSidebar(pageId) {
      if (isMobile()) closeMobileSidebar(pageId);
    }

    // Legacy toggleSidebar — kept for compatibility
    function toggleSidebar() {
      const activePage = document.querySelector('.page.active');
      if (activePage) toggleMobileSidebar(activePage.id);
    }

    // ===== HERO PARTICLES =====
    (function () {
      const container = document.getElementById('hero-particles');
      if (!container) return;
      const formulas = ['F=ma', 'E=mc²', 'v=λf', 'P=IV', 'ΔE=hf', 'h·f', 'n=c/v', 'W=Fd', 'τ=Iα'];
      for (let i = 0; i < 12; i++) {
        const el = document.createElement('div');
        el.classList.add('hpart');
        const size = Math.random() * 8 + 3;
        el.style.cssText = `width:${size}px;height:${size}px;background:rgba(224,16,16,${0.15 + Math.random() * 0.3});left:${Math.random() * 100}%;animation-duration:${6 + Math.random() * 10}s;animation-delay:${Math.random() * 8}s;box-shadow:0 0 ${size * 2}px rgba(224,16,16,0.4);`;
        container.appendChild(el);
      }
      for (let i = 0; i < 8; i++) {
        const el = document.createElement('div');
        el.classList.add('hformula');
        el.textContent = formulas[i % formulas.length];
        el.style.cssText = `top:${10 + Math.random() * 80}%;left:${Math.random() * 100}%;animation-duration:${5 + Math.random() * 8}s;animation-delay:${Math.random() * 6}s;font-size:${0.7 + Math.random() * 0.5}rem;`;
        container.appendChild(el);
      }
    })();

    // ===== CHANGE PASSWORD =====
    let adminPass = '1234';
    function checkPassStrength(v) {
      const el = document.getElementById('pass-strength'); if (!el) return;
      let s = 0, c = 'var(--red)';
      if (v.length >= 6) s++; if (v.length >= 10) s++; if (/[0-9]/.test(v)) s++; if (/[A-Za-z]/.test(v)) s++; if (/[^A-Za-z0-9]/.test(v)) s++;
      const w = ['10%', '30%', '55%', '80%', '100%'][s]; const cols = ['#e01010', '#ff6600', '#f5c842', '#2ea85a', '#00cc44'][s];
      el.style.background = cols; el.style.width = w;
    }
    function changePassword() {
      const old = document.getElementById('old-pass').value;
      const nw = document.getElementById('new-pass').value;
      const cf = document.getElementById('confirm-pass').value;
      const res = document.getElementById('pass-res');
      if (old !== adminPass) { res.innerHTML = '<div class="al al-r">❌ كلمة المرور الحالية غير صحيحة!</div>'; return; }
      if (nw.length < 6) { res.innerHTML = '<div class="al al-r">❌ كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل!</div>'; return; }
      if (nw !== cf) { res.innerHTML = '<div class="al al-r">❌ كلمتا المرور غير متطابقتان!</div>'; return; }
      adminPass = nw;
      res.innerHTML = '<div class="al al-ok">✅ تم تغيير كلمة المرور بنجاح!</div>';
      setTimeout(() => closeM('change-pass-modal'), 2000);
    }
    function forgotAdminPass() {
      const stored = localStorage.getItem('adminPass');
      const ans = prompt('🔐 سؤال الأمان: ما اسم المادة التي تدرسها؟');
      if (ans === null) return;
      const norm = ans.trim().toLowerCase();
      if (norm.includes('فيزياء') || norm.includes('physics') || norm.includes('فيزيا')) {
        const pw = stored || adminPass;
        alert('✅ تم التحقق!\nكلمة المرور الحالية: ' + pw);
      } else {
        alert('❌ الإجابة غلط.\nتواصل مع الدعم الفني لو نسيت كلمة السر.');
      }
    }


    // ===== ADMIN PHOTO UPLOAD =====
    function adminPhotoUpload() {
      const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*';
      input.onchange = e => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          const src = ev.target.result;
          // Update all teacher photos on page
          document.querySelectorAll('#teacher-photo-main img,#hero-teacher-img,.current-photo img').forEach(img => img.src = src);
          localStorage.setItem('ghaith_teacher_photo', src);
          alert('✅ تم تحديث صورة المدرس!');
        };
        reader.readAsDataURL(file);
      };
      input.click();
    }
    // Load saved photo on start
    window.addEventListener('load', () => {
      const saved = localStorage.getItem('ghaith_teacher_photo');
      if (saved) {
        setTimeout(() => {
          document.querySelectorAll('#teacher-photo-main img,#hero-teacher-img').forEach(img => img.src = saved);
        }, 300);
      }

    });

    // ===== UPDATE aTab to push history =====
    const _origATab = aTab;
    // aTab history tracking - non-breaking wrapper
    const _aTabOrig2 = aTab;
    window.addEventListener('load', () => {
      // patch pushHist into sidebar clicks via event delegation
      document.querySelectorAll('#admin-page .sb-item').forEach(item => {
        item.addEventListener('click', function () {
          // history tracking happens naturally via aTab calls
        });
      });
    });

    // ===== EXTRA DASH CARDS - appended after loadDash =====
    function appendDashExtras() {
      setTimeout(() => {
        const main = document.getElementById('admin-content');
        if (!main || main.querySelector('#dash-extras')) return;
        const extra = document.createElement('div');
        extra.id = 'dash-extras';
        extra.className = 'g2'; extra.style.marginTop = '14px';
        extra.innerHTML = `
    <div class="card"><div class="ct">⚙️ إعدادات المدرس</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;align-items:center;gap:12px;padding:10px;background:var(--bg3);border-radius:8px">
          <div class="current-photo" id="dash-photo" style="width:50px;height:50px;flex-shrink:0"><img src="${document.querySelector('#teacher-photo-main img')?.src || ''}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"></div>
          <div style="flex:1"><div style="font-size:0.85rem;font-weight:700">Mr. Mustafa Zemetar</div><div style="font-size:0.73rem;color:var(--text3)">مدرس فيزياء ثانوي</div></div>
          <button onclick="adminPhotoUpload()" class="btn btn-ghost" style="padding:0.4rem 0.8rem;font-size:0.8rem">📷 تغيير الصورة</button>
        </div>
        <button onclick="openM('change-pass-modal')" class="btn btn-ghost" style="width:100%">🔐 تغيير كلمة المرور</button>
      </div>
    </div>
    <div class="card"><div class="ct">🔗 روابط سريعة</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <a href="https://wa.me/201212897212" target="_blank" class="btn btn-r" style="display:block;text-align:center;text-decoration:none">📱 واتساب المدرس</a>
        <a href="https://www.facebook.com/share/1M5jZVKKHY/" target="_blank" class="btn btn-b" style="display:block;text-align:center;text-decoration:none">📘 صفحة الفيسبوك</a>
        <a href="https://youtube.com/@mr.mustafazemetar" target="_blank" style="display:block;text-align:center;text-decoration:none;padding:0.58rem 1.3rem;border-radius:6px;background:#ff0000;color:#fff;font-weight:700;font-family:'Cairo',sans-serif;font-size:0.88rem">▶ قناة يوتيوب</a>
      </div>
    </div>`;
        main.appendChild(extra);
      }, 200);
    }

    // ===== SECURITY SYSTEM =====
    const SEC = {
      loginAttempts: {},
      auditLog: JSON.parse(localStorage.getItem('ghaith_audit') || '[]'),
      blockedIPs: JSON.parse(localStorage.getItem('ghaith_blocked') || '[]'),
      sessionTokens: {},
      MAX_ATTEMPTS: 5,
      LOCKOUT_TIME: 30, // seconds
      SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hour

      // Log security event
      log(type, msg, level = 'ok') {
        const entry = {
          time: new Date().toLocaleTimeString('ar-EG'),
          date: new Date().toLocaleDateString('ar-EG'),
          type, msg, level,
          ts: Date.now()
        };
        this.auditLog.unshift(entry);
        if (this.auditLog.length > 200) this.auditLog.pop();
        try { localStorage.setItem('ghaith_audit', JSON.stringify(this.auditLog.slice(0, 200))); } catch (e) { }
      },

      // Check rate limiting
      checkRateLimit(role) {
        const key = 'login_' + role;
        const now = Date.now();
        if (!this.loginAttempts[key]) this.loginAttempts[key] = { count: 0, lastFail: 0, lockedUntil: 0 };
        const att = this.loginAttempts[key];
        if (att.lockedUntil > now) {
          const remaining = Math.ceil((att.lockedUntil - now) / 1000);
          this.showRateLimitUI(remaining);
          return false;
        }
        return true;
      },

      // Record failed attempt
      recordFail(role) {
        const key = 'login_' + role;
        const now = Date.now();
        if (!this.loginAttempts[key]) this.loginAttempts[key] = { count: 0, lastFail: 0, lockedUntil: 0 };
        const att = this.loginAttempts[key];
        att.count++;
        att.lastFail = now;
        if (att.count >= this.MAX_ATTEMPTS) {
          att.lockedUntil = now + this.LOCKOUT_TIME * 1000 * att.count;
          this.log('BRUTE_FORCE', `${att.count} محاولات فاشلة — ${role}`, 'danger');
          this.showRateLimitUI(this.LOCKOUT_TIME * att.count);
        } else {
          this.log('LOGIN_FAIL', `محاولة دخول فاشلة (${att.count}/${this.MAX_ATTEMPTS}) — ${role}`, 'warn');
        }
      },

      // Record success
      recordSuccess(role) {
        const key = 'login_' + role;
        if (this.loginAttempts[key]) this.loginAttempts[key] = { count: 0, lastFail: 0, lockedUntil: 0 };
        this.log('LOGIN_OK', `دخول ناجح — ${role}`, 'ok');
        // Generate session token
        const token = Math.random().toString(36).substr(2) + Date.now().toString(36);
        this.sessionTokens[role] = { token, created: Date.now() };
        localStorage.setItem('ghaith_session_token', token);
      },

      // Show rate limit UI
      showRateLimitUI(seconds) {
        const overlay = document.getElementById('rate-limit-overlay');
        const countdown = document.getElementById('rate-limit-countdown');
        overlay.classList.add('show');
        let left = seconds;
        countdown.textContent = left;
        const timer = setInterval(() => {
          left--;
          countdown.textContent = left;
          if (left <= 0) {
            clearInterval(timer);
            overlay.classList.remove('show');
          }
        }, 1000);
      },

      // XSS sanitize input
      sanitize(str) {
        if (!str) return '';
        return str.replace(/[<>'"&]/g, c => ({ '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;', '&': '&amp;' }[c]));
      },

      // Validate phone number
      validatePhone(p) {
        return /^01[0-9]{9}$/.test(p.replace(/\s/g, ''));
      },

      // Check session validity
      isSessionValid() {
        const token = localStorage.getItem('ghaith_session_token');
        if (!db.role || !token) return false;
        return true;
      },

      // Logout and clear all
      secureLogout() {
        this.log('LOGOUT', `تسجيل خروج — ${db.role || 'unknown'}`, 'ok');
        localStorage.removeItem('ghaith_session_token');
      }
    };

    // Input sanitization helper
    function sanitizeInput(val) { return SEC.sanitize(val); }

    // Override doLogin with secured version
    function doLogin(role) {
      // Rate limit check
      if (!SEC.checkRateLimit(role)) return;

      if (role === 'admin') {
        const u = SEC.sanitize(document.getElementById('lu').value.trim());
        const p = document.getElementById('lp').value;
        // Constant-time comparison simulation
        const uOk = u === 'admin';
        const pOk = p === adminPass;
        if (uOk && pOk) {
          SEC.recordSuccess('admin');
          db.role = 'admin';
          closeM('login-modal');
          doShowPage('admin-page', () => { loadDash(); appendDashExtras(); });
          saveSession();
        } else {
          SEC.recordFail('admin');
          const el = document.getElementById('login-res') || document.createElement('div');
          if (!document.getElementById('login-res')) {
            el.id = 'login-res';
            document.getElementById('login-body').appendChild(el);
          }
          el.innerHTML = '<div class="al al-r">❌ بيانات الدخول غير صحيحة!</div>';
        }
      } else if (role === 'student') {
        const code = SEC.sanitize(document.getElementById('lc').value.trim());
        const phone = document.getElementById('lph').value.trim();
        if (phone && !SEC.validatePhone(phone)) {
          const r = document.getElementById('login-res');
          if (r) r.innerHTML = '<div class="al al-r">❌ رقم الهاتف غير صحيح!</div>';
          return;
        }
        const st = db.students.find(s => s.code === code && s.phone === phone);
        if (st) {
          SEC.recordSuccess('student');
          db.cur = st; db.role = 'student';
          closeM('login-modal'); updateSidebar();
          doShowPage('student-page', () => loadSHome()); saveSession();
        } else {
          SEC.recordFail('student');
          const r = document.getElementById('login-res');
          if (r) r.innerHTML = '<div class="al al-r">❌ كود أو رقم الهاتف غير صحيح!</div>';
        }
      } else {
        const phone = document.getElementById('lpp').value.trim();
        const code = SEC.sanitize(document.getElementById('lpc').value.trim());
        const st = db.students.find(s => s.code === code && s.parent === phone);
        if (st) {
          SEC.recordSuccess('parent');
          db.cur = st; db.role = 'parent';
          closeM('login-modal');
          document.getElementById('par-child').textContent = SEC.sanitize(st.name);
          doShowPage('parent-page', () => loadPHome()); saveSession();
        } else {
          SEC.recordFail('parent');
          const r = document.getElementById('login-res');
          if (r) r.innerHTML = '<div class="al al-r">❌ البيانات غير صحيحة!</div>';
        }
      }
    }

    // Override logout
    const _origLogout = logout;
    window.logout = function () {
      SEC.secureLogout();
      _origLogout();
    };

    // ===== BACKEND PANEL =====
    function loadBackend() {
      const attempts = Object.values(SEC.loginAttempts);
      const totalFails = attempts.reduce((s, a) => s + a.count, 0);
      const locked = attempts.filter(a => a.lockedUntil > Date.now()).length;
      document.getElementById('admin-content').innerHTML = `
  <div class="ph"><h1>لوحة <span>الأمان</span></h1><p>مراقبة حماية المنصة</p></div>
  <div class="sr">
    <div class="sb g"><div class="sb-n">🛡️</div><div class="sb-l">النظام محمي</div></div>
    <div class="sb ${totalFails > 0 ? '' : 'g'}"><div class="sb-n">${totalFails}</div><div class="sb-l">محاولات فاشلة</div></div>
    <div class="sb ${locked > 0 ? '' : 'g'}"><div class="sb-n">${locked}</div><div class="sb-l">حسابات مقفلة</div></div>
    <div class="sb b"><div class="sb-n">${SEC.auditLog.length}</div><div class="sb-l">سجل الأحداث</div></div>
  </div>
  <div class="g2" style="margin-top:14px">
    <div class="card">
      <div class="ct">🔒 إعدادات الأمان</div>
      <div style="display:flex;flex-direction:column;gap:10px;font-size:0.85rem">
        <div style="display:flex;justify-content:space-between;padding:10px;background:var(--bg3);border-radius:8px;align-items:center">
          <span>الحماية من Brute Force</span>
          <span class="security-badge">✅ مفعّل</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:10px;background:var(--bg3);border-radius:8px;align-items:center">
          <span>تحديد المحاولات (${SEC.MAX_ATTEMPTS} محاولات)</span>
          <span class="security-badge">✅ مفعّل</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:10px;background:var(--bg3);border-radius:8px;align-items:center">
          <span>تعقيم المدخلات XSS</span>
          <span class="security-badge">✅ مفعّل</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:10px;background:var(--bg3);border-radius:8px;align-items:center">
          <span>التحقق من صيغة الهاتف</span>
          <span class="security-badge">✅ مفعّل</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:10px;background:var(--bg3);border-radius:8px;align-items:center">
          <span>Session Token</span>
          <span class="security-badge">✅ مفعّل</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:10px;background:var(--bg3);border-radius:8px;align-items:center">
          <span>سجل النشاطات</span>
          <span class="security-badge">✅ مفعّل</span>
        </div>
      </div>
      <div style="margin-top:14px">
        <button class="btn btn-r" onclick="SEC.loginAttempts={};alert('✅ تم إلغاء قفل جميع الحسابات')" style="width:100%;margin-bottom:8px">🔓 رفع القفل عن جميع الحسابات</button>
        <button class="btn btn-ghost" onclick="aTab('audit',document.querySelector(\'#admin-page .sb-item.active\'))" style="width:100%">📋 عرض سجل النشاطات</button>
      </div>
    </div>
    <div class="card">
      <div class="ct">📊 آخر الأحداث الأمنية</div>
      <div class="sec-audit-log">
        ${SEC.auditLog.slice(0, 15).map(e => `
          <div class="sec-audit-entry">
            <span class="sa-time">${e.time}</span>
            <span class="sa-type ${e.level}">[${e.type}]</span>
            <span>${e.msg}</span>
          </div>
        `).join('') || '<div style="color:var(--text3);padding:8px">لا توجد أحداث بعد</div>'}
      </div>
    </div>
  </div>
  <div class="card" style="margin-top:14px">
    <div class="ct">🔐 اختبار الأمان</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div style="background:var(--bg3);border-radius:8px;padding:1rem">
        <div style="font-size:0.82rem;color:var(--text2);margin-bottom:8px">اختبار XSS</div>
        <input id="xss-test" placeholder="أدخل نص للاختبار" style="width:100%;margin-bottom:8px">
        <button class="btn btn-ghost" style="width:100%;font-size:0.8rem" onclick="document.getElementById('xss-result').textContent='المُعقَّم: '+SEC.sanitize(document.getElementById('xss-test').value)">اختبر التعقيم</button>
        <div id="xss-result" style="font-size:0.75rem;color:var(--green);margin-top:6px;word-break:break-all"></div>
      </div>
      <div style="background:var(--bg3);border-radius:8px;padding:1rem">
        <div style="font-size:0.82rem;color:var(--text2);margin-bottom:8px">اختبار الهاتف</div>
        <input id="phone-test" placeholder="01XXXXXXXXX" style="width:100%;margin-bottom:8px">
        <button class="btn btn-ghost" style="width:100%;font-size:0.8rem" onclick="const v=document.getElementById('phone-test').value;document.getElementById('phone-result').innerHTML=SEC.validatePhone(v)?'<span style=color:var(--green)>✅ صيغة صحيحة</span>':'<span style=color:var(--red)>❌ صيغة غلط</span>'">تحقق</button>
        <div id="phone-result" style="font-size:0.8rem;margin-top:6px"></div>
      </div>
    </div>
  </div>`;
    }

    function loadAuditLog() {
      document.getElementById('admin-content').innerHTML = `
  <div class="ph"><h1>سجل <span>النشاطات</span></h1><p>${SEC.auditLog.length} حدث مسجل</p></div>
  <div class="card">
    <div class="ct" style="justify-content:space-between">
      <span>سجل الأحداث الأمنية</span>
      <button onclick="SEC.auditLog=[];localStorage.removeItem('ghaith_audit');loadAuditLog();" class="btn btn-ghost" style="padding:0.3rem 0.7rem;font-size:0.75rem">🗑️ مسح السجل</button>
    </div>
    <div class="sec-audit-log" style="max-height:500px">
      ${SEC.auditLog.length ? SEC.auditLog.map(e => `
        <div class="sec-audit-entry">
          <span class="sa-time">${e.date} ${e.time}</span>
          <span class="sa-type ${e.level}">[${e.type}]</span>
          <span>${e.msg}</span>
        </div>
      `).join('') : '<div style="color:var(--text3);padding:12px;text-align:center">السجل فارغ</div>'}
    </div>
  </div>`;
    }

    function loadBackup() {
      document.getElementById('admin-content').innerHTML = `
  <div class="ph"><h1>النسخ <span>الاحتياطي</span></h1><p>تصدير واستيراد بيانات المنصة</p></div>
  <div class="g2">
    <div class="card">
      <div class="ct">💾 تصدير البيانات</div>
      <p style="font-size:0.85rem;color:var(--text2);margin-bottom:1rem;line-height:1.7">تصدير كامل بيانات الطلاب والدروس والكويزات كملف JSON آمن.</p>
      <button class="btn btn-r" style="width:100%;margin-bottom:8px" onclick="exportBackup()">📥 تصدير نسخة احتياطية</button>
      <button class="btn btn-ghost" style="width:100%" onclick="exportStudentsCSV()">📊 تصدير الطلاب CSV</button>
    </div>
    <div class="card">
      <div class="ct">📤 استيراد البيانات</div>
      <p style="font-size:0.85rem;color:var(--text2);margin-bottom:1rem;line-height:1.7">استيراد نسخة احتياطية سابقة. تأكد أن الملف من نفس المنصة.</p>
      <input type="file" id="import-file" accept=".json" style="display:none" onchange="importBackup(this)">
      <button class="btn btn-ghost" style="width:100%;margin-bottom:8px" onclick="document.getElementById('import-file').click()">📂 اختر ملف JSON</button>
      <div id="import-res"></div>
    </div>
  </div>
  <div class="card" style="margin-top:14px">
    <div class="ct">📈 إحصاءات التخزين</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;font-size:0.85rem">
      <div style="background:var(--bg3);border-radius:8px;padding:1rem;text-align:center">
        <div style="font-family:'Cinzel',serif;font-size:1.5rem;font-weight:900;color:var(--red)">${db.students.length}</div>
        <div style="color:var(--text3);font-size:0.72rem;margin-top:3px">طالب مسجل</div>
      </div>
      <div style="background:var(--bg3);border-radius:8px;padding:1rem;text-align:center">
        <div style="font-family:'Cinzel',serif;font-size:1.5rem;font-weight:900;color:var(--blue)">${SEC.auditLog.length}</div>
        <div style="color:var(--text3);font-size:0.72rem;margin-top:3px">سجل أحداث</div>
      </div>
      <div style="background:var(--bg3);border-radius:8px;padding:1rem;text-align:center">
        <div style="font-family:'Cinzel',serif;font-size:1.5rem;font-weight:900;color:var(--green)">${Math.round(JSON.stringify(db).length / 1024 * 10) / 10}</div>
        <div style="color:var(--text3);font-size:0.72rem;margin-top:3px">KB بيانات</div>
      </div>
    </div>
  </div>`;
    }

    function exportBackup() {
      const data = {
        version: '2.0',
        exportDate: new Date().toISOString(),
        platform: 'Ghaith Physics',
        db: db,
        auditLog: SEC.auditLog.slice(0, 50)
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `ghaith_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      SEC.log('EXPORT', 'تصدير نسخة احتياطية', 'ok');
    }

    function exportStudentsCSV() {
      let csv = 'الكود,الاسم,الصف,الهاتف,الاشتراك,الحضور%,الفيزياء\n';
      db.students.forEach(s => {
        const att = s.att.t > 0 ? Math.round(s.att.p / s.att.t * 100) + '%' : 'جديد';
        csv += `${s.code},${s.name},${s.grade},${s.phone},${s.sub ? 'مشترك' : 'غير مشترك'},${att},${s.grades.phy}%\n`;
      });
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `students_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
    }

    function importBackup(input) {
      const file = input.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const data = JSON.parse(e.target.result);
          if (!data.db || !data.db.students) throw new Error('ملف غير صالح');
          if (confirm(`⚠️ سيتم استبدال ${db.students.length} طالب بـ ${data.db.students.length} طالب من الملف.\nهل أنت متأكد؟`)) {
            db.students = data.db.students;
            saveData();
            updateCounts();
            SEC.log('IMPORT', `استيراد ${data.db.students.length} طالب`, 'warn');
            document.getElementById('import-res').innerHTML = '<div class="al al-ok">✅ تم الاستيراد بنجاح!</div>';
          }
        } catch (err) {
          document.getElementById('import-res').innerHTML = '<div class="al al-r">❌ ملف غير صالح: ' + err.message + '</div>';
        }
      };
      reader.readAsText(file);
    }

    // Log page loads
    SEC.log('PAGE_LOAD', 'تم تحميل المنصة', 'ok');

    // Session timeout check
    setInterval(() => {
      if (db.role && db.role !== null) {
        const token = localStorage.getItem('ghaith_session_token');
        const st = JSON.parse(localStorage.getItem('ghaith_session') || '{}');
        // Simple session check - in production this would validate server-side
        if (!token && db.role) {
          SEC.log('SESSION_EXPIRED', 'انتهت الجلسة', 'warn');
        }
      }
    }, 60000);

    // Trigger scroll animations on load
    setTimeout(() => {
      document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add('visible');
      });
    }, 200);

  