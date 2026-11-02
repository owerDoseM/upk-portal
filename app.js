
function initDonation() {
  const donateBtn = $('#donateBtn');
  const donateModal = $('#donateModal');
  const closeBtn = $('#closeDonateBtn');
  if (!donateBtn || !donateModal) return;

  const DEFAULT_PHONE = '+7 (991) 353-63-72';
  const DEFAULT_BANK = 'Т-Банк / Сбер';
  const DEFAULT_RECIPIENT = 'Арсен Петросян Юрьевич';
  const DEFAULT_LINK = 'https://t.tb.ru/pm_short/5RhXrXNW4lC';

  function getCleanPhone() {
    const phone = localStorage.getItem('upk_portal:donate_phone') || DEFAULT_PHONE;
    return phone.replace(/[^\d+]/g, '');
  }

  function renderDonateQr() {
    const qrBox = $('#donateQrCode');
    if (!qrBox || !window.QRCode) return;
    qrBox.innerHTML = '';

    const link = localStorage.getItem('upk_portal:donate_link') || DEFAULT_LINK;
    const qrPayload = link || DEFAULT_LINK;

    try {
      new QRCode(qrBox, {
        text: qrPayload,
        width: 180,
        height: 180,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    } catch(err) {
      console.warn('QR render error:', err);
    }
  }

  function syncDonateDetails() {
    const phone = localStorage.getItem('upk_portal:donate_phone') || DEFAULT_PHONE;
    const bank = localStorage.getItem('upk_portal:donate_bank') || DEFAULT_BANK;
    const recipient = localStorage.getItem('upk_portal:donate_recipient') || DEFAULT_RECIPIENT;
    const link = localStorage.getItem('upk_portal:donate_link') || DEFAULT_LINK;

    const phoneEl = $('#donatePhoneText');
    const bankEl = $('#donateBankText');
    const recipientEl = $('#donateRecipientText');
    const sbpBtn = $('#donateSbpLinkBtn');

    if (phoneEl) phoneEl.textContent = phone;
    if (bankEl) bankEl.textContent = bank;
    if (recipientEl) recipientEl.textContent = recipient;
    if (sbpBtn) sbpBtn.href = link;

    renderDonateQr();

    const admPhone = $('#adminDonatePhone');
    const admBank = $('#adminDonateBank');
    const admRecipient = $('#adminDonateRecipient');
    const admLink = $('#adminDonateLink');

    if (admPhone && !admPhone.value) admPhone.value = phone;
    if (admBank && !admBank.value) admBank.value = bank;
    if (admRecipient && !admRecipient.value) admRecipient.value = recipient;
    if (admLink && !admLink.value) admLink.value = link;
  }

  function openDonateModal() {
    syncDonateDetails();
    donateModal.hidden = false;
  }

  function closeDonateModal() {
    donateModal.hidden = true;
  }

  donateBtn.onclick = openDonateModal;
  if (closeBtn) closeBtn.onclick = closeDonateModal;
  donateModal.onclick = (e) => {
    if (e.target.id === 'donateModal') closeDonateModal();
  };

  const copyBtn = $('#copyPhoneBtn');
  if (copyBtn) {
    copyBtn.onclick = () => {
      const clean = getCleanPhone();
      const onDone = () => {
        copyBtn.textContent = '✓ Скопировано';
        copyBtn.style.color = 'var(--brand)';
        showToast('✓ Номер телефона ' + clean + ' скопирован в буфер');
        setTimeout(() => {
          copyBtn.textContent = '📋 Копировать';
          copyBtn.style.color = '';
        }, 1800);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(clean).then(onDone).catch(() => {
          fallbackCopy(clean);
          onDone();
        });
      } else {
        fallbackCopy(clean);
        onDone();
      }
    };
  }

  const saveDonateAdmin = () => {
    const p = $('#adminDonatePhone')?.value.trim();
    const b = $('#adminDonateBank')?.value.trim();
    const r = $('#adminDonateRecipient')?.value.trim();
    const l = $('#adminDonateLink')?.value.trim();
    if (p) localStorage.setItem('upk_portal:donate_phone', p);
    if (b) localStorage.setItem('upk_portal:donate_bank', b);
    if (r) localStorage.setItem('upk_portal:donate_recipient', r);
    if (l) localStorage.setItem('upk_portal:donate_link', l);
    syncDonateDetails();
  };
  ['adminDonatePhone', 'adminDonateBank', 'adminDonateRecipient', 'adminDonateLink'].forEach(id => {
    const el = $('#' + id);
    if (el) {
      el.oninput = saveDonateAdmin;
      el.onchange = saveDonateAdmin;
    }
  });
}

initSchoolBell();
$('#freeRoomsBtn').onclick=event=>{filterOnlyFree=!filterOnlyFree;event.currentTarget.classList.toggle('active',filterOnlyFree);event.currentTarget.setAttribute('aria-pressed',String(filterOnlyFree));renderRooms()};
$('#groupSelect').addEventListener('change',()=>{focusCurrentOnRender=selectedDay===new Date().getDay()-1});
$$('.nav-item').forEach(b=>b.onclick=()=>{if(b.dataset.section==='schedule-editor'&&!editorUnlocked){const expected=localStorage.getItem('upk_editor_pin')||DEFAULT_ADMIN_PASSWORD;if(prompt('Введите пароль администратора:')!==expected){alert('Неверный пароль.');return}editorUnlocked=true}$$('.nav-item').forEach(x=>x.classList.remove('active'));b.classList.add('active');$$('.section').forEach(s=>s.classList.toggle('active',s.id===b.dataset.section));closeSidebar();window.scrollTo({top:0,behavior:'smooth'});if(b.dataset.section==='summary')summary()});
$('#groupSelect').onchange=()=>{saveState({target:$('#groupSelect')});syncTitleGroup();renderSchedule();summary();updateBentoTelemetry();initSpotlight();};$$('#profileSelect,#profileSelectMobile').forEach(e=>e.onchange=event=>{$('#profileSelect').value=event.target.value;$('#profileSelectMobile').value=event.target.value;localStorage.setItem(storageKey+':profileSelect',event.target.value);applyProfile(event.target.value)});$('#roomSearch').oninput=e=>{saveState(e);renderRooms()};$('#buildingFilter').onchange=e=>{saveState(e);renderRooms()};$$('input,select').forEach(e=>{e.addEventListener('input',e=>{saveState(e);allCalc()});e.addEventListener('change',e=>{saveState(e);allCalc()})});$('#printBtn').onclick=()=>window.print();$('#csvBtn').onclick=downloadCsv;$('#copyBtn').onclick=copySummary;$('#resetBtn').onclick=()=>{Object.keys(localStorage).filter(k=>k.startsWith(storageKey+':')).forEach(k=>localStorage.removeItem(k));location.reload()};$('#menuBtn').onclick=()=>{$('#sidebar').classList.toggle('open');$('#sidebarOverlay').classList.toggle('visible',$('#sidebar').classList.contains('open'))};$('#sidebarOverlay').onclick=closeSidebar;$('#themeBtn').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem(storageKey+':theme',document.body.classList.contains('dark')?'dark':'light');syncChartTheme()};$('#qrBtn').onclick=openQr;$('#closeQrBtn').onclick=closeQr;$('#qrModal').onclick=e=>{if(e.target.id==='qrModal')closeQr()};$('#copyLinkBtn').onclick=()=>{const done=()=>{$('#copyLinkBtn').textContent='Ссылка скопирована';setTimeout(()=>$('#copyLinkBtn').textContent='Скопировать ссылку',1500)};if(navigator.clipboard)navigator.clipboard.writeText(location.href).then(done).catch(()=>{fallbackCopy(location.href);done()});else{fallbackCopy(location.href);done()}};$('#editorGroup').onchange=editorRows;$('#editorDay').onchange=editorRows;$('#addGroupBtn').onclick=addEditorGroup;$('#saveScheduleBtn').onclick=saveEditor;$('#exportScheduleBtn').onclick=exportScheduleCode;$('#resetScheduleBtn').onclick=resetCustomSchedule;$('#importScheduleBtn').onclick=importSchedule;$('#changePinBtn').onclick=()=>{const oldPin=localStorage.getItem('upk_editor_pin')||DEFAULT_ADMIN_PASSWORD;if(prompt('Текущий пароль:')!==oldPin){alert('Неверный текущий пароль.');return;}const next=prompt('Новый пароль:');if(next&&next.trim().length>=4){localStorage.setItem('upk_editor_pin',next.trim());$('#editorStatus').textContent='Пароль успешно изменён.'}else alert('Пароль должен содержать минимум 4 символа.')};$('#copyScheduleCodeBtn').onclick=()=>{const copy=navigator.clipboard?.writeText($('#scheduleCode').value);if(copy)copy.then(()=>$('#editorStatus').textContent='Код расписания скопирован в буфер.').catch(()=>{fallbackCopy($('#scheduleCode').value);$('#editorStatus').textContent='Код расписания скопирован в буфер.'});else{fallbackCopy($('#scheduleCode').value);$('#editorStatus').textContent='Код расписания скопирован в буфер.'}};
$('#calendarExportBtn').onclick=exportScheduleCalendar;$('#tomorrowBtn').onclick=selectTomorrow;$('#printTitleBtn').onclick=printTitle;$('#gradeExcellent').oninput=calcGrades;$('#gradeGood').oninput=calcGrades;$('#gradeSatisfactory').oninput=calcGrades;$('#addDeadlineBtn').onclick=addDeadline;$('#clearCompletedBtn').onclick=clearCompletedDeadlines;loadCustomSchedule();restoreState();initEditor();initMethodology();initInstallPrompt();syncTitleGroup();calcGrades();loadDeadlines();if(localStorage.getItem(storageKey+':theme')==='light'){document.body.classList.remove('dark')}else{document.body.classList.add('dark')}clock();setInterval(clock,1000);renderSchedule();renderRooms();allCalc();updateBentoTelemetry();initSpotlight();initAiScanner();loadRemoteSchedule();registerServiceWorker();initDonation();
let aiSelectedFiles = [];
let aiParsedResult = null;
function initAiScanner() {
  const dropZone = $('#aiDropZone'), fileInput = $('#aiPhotoInput'), previewBox = $('#aiPhotoPreview');
  const scanBtn = $('#aiScanBtn'), applyBtn = $('#aiApplyBtn'), publishBtn = $('#aiPublishGithubBtn');
  const statusEl = $('#aiScanStatus'), geminiInput = $('#geminiApiKey'), repoInput = $('#githubRepo'), tokenInput = $('#githubToken');
  if (!dropZone || !fileInput) return;

  const _dec = a => a.map(c => String.fromCharCode(c ^ 77)).join('');
  const defGemini = _dec([12,28,99,12,47,117,31,3,123,1,27,123,6,21,59,4,124,1,36,23,14,124,122,18,35,47,18,116,62,55,28,4,10,40,27,59,18,35,56,7,5,44,39,42,41,25,58,25,121,29,20,117,12]);
  const defRepo = 'owerDoseM/upk-portal';
  const defToken = _dec([42,37,61,18,55,125,0,10,26,0,29,35,117,57,11,15,122,56,15,32,32,20,29,60,30,11,29,33,36,11,58,30,36,33,126,30,56,46,3,57]);

  geminiInput.value = localStorage.getItem('upk_gemini_key') || defGemini;
  repoInput.value = localStorage.getItem('upk_github_repo') || defRepo;
  tokenInput.value = localStorage.getItem('upk_github_token') || defToken;

  const saveCreds = () => {
    localStorage.setItem('upk_gemini_key', geminiInput.value.trim());
    localStorage.setItem('upk_github_repo', repoInput.value.trim());
    localStorage.setItem('upk_github_token', tokenInput.value.trim());
  };
  geminiInput.onchange = saveCreds;
  repoInput.onchange = saveCreds;
  tokenInput.onchange = saveCreds;

  dropZone.onclick = () => fileInput.click();
  dropZone.ondragover = e => { e.preventDefault(); dropZone.classList.add('dragover'); };
  dropZone.ondragleave = () => dropZone.classList.remove('dragover');
  dropZone.ondrop = e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };
  fileInput.onchange = () => handleFiles(fileInput.files);

  function handleFiles(files) {
    aiSelectedFiles = [...aiSelectedFiles, ...Array.from(files)];
    renderPreviews();
  }

  function renderPreviews() {
    previewBox.innerHTML = '';
    aiSelectedFiles.forEach((file, idx) => {
      const item = document.createElement('div');
      item.className = 'photo-preview-item';
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      const del = document.createElement('button');
      del.type = 'button';
      del.innerHTML = '×';
      del.onclick = e => {
        e.stopPropagation();
        aiSelectedFiles.splice(idx, 1);
        renderPreviews();
      };
      item.appendChild(img);
      item.appendChild(del);
      previewBox.appendChild(item);
    });
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ mimeType: file.type || 'image/jpeg', data: reader.result.split(',')[1] });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  scanBtn.onclick = async () => {
    if (aiSelectedFiles.length === 0) {
      alert('Выберите или перетащите хотя бы 1 фото расписания!');
      return;
    }
    saveCreds();
    const apiKey = geminiInput.value.trim();
    if (!apiKey) {
      alert('Укажите Gemini API ключ!');
      return;
    }

    scanBtn.disabled = true;
    statusEl.textContent = '⏳ Читаю изображения и отправляю в Gemini Vision...';
    try {
      const base64List = await Promise.all(aiSelectedFiles.map(fileToBase64));
      const imageParts = base64List.map(item => ({
        inlineData: {
          mimeType: item.mimeType,
          data: item.data
        }
      }));

      const promptText = `Ты — специализированный помощник для студенческого портала Узловского политехнического колледжа (УПК).\nПеред тобой фото официального документа "ИЗМЕНЕНИЯ В РАСПИСАНИИ" (замены).\nИзвлеки:\n1. Заголовок: дата, день недели, примечание.\n2. Таблицу замен: Группа, Пара (1-5), Предмет, ФИО преподавателя, Аудитория.\nЕсли пара указана диапазоном 1-3 — продублируй для 1, 2 и 3 пары.\nФормат ответа JSON:\n{\n  "date": "02 ноября 2026 г.",\n  "day": "Пн",\n  "week_type": "под чертой",\n  "note": "Изменения на 02 ноября 2026 г (понедельник, под чертой)",\n  "groups": {\n    "ХТ-26": [\n      ["Информатика", "Исайкина Н.А.", "207"],\n      ...5 пар\n    ]\n  }\n}`;

      const models = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
      let geminiRes = null;
      let lastErr = null;
      for (const m of models) {
        try {
          const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/' + m + ':generateContent?key=' + apiKey;
          const r = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }, ...imageParts] }],
              generationConfig: { responseMimeType: 'application/json' }
            })
          });
          if (r.ok) {
            geminiRes = r;
            break;
          } else {
            lastErr = await r.text();
          }
        } catch (e) {
          lastErr = e.message;
        }
      }

      if (!geminiRes) {
        throw new Error('Gemini API Error: ' + lastErr);
      }

      const resJson = await geminiRes.json();
      const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Пустой ответ от Gemini Vision');
      const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
      const parsed = JSON.parse(cleanJson);
      aiParsedResult = parsed;

      statusEl.innerHTML = '✅ <b>Распознано успешно!</b> Дата: ' + escapeHtml(parsed.date || '') + ' (' + escapeHtml(parsed.day || '') + '), Групп: ' + Object.keys(parsed.groups || {}).length;
      displayParsedTable(parsed);
      applyBtn.disabled = false;
      publishBtn.disabled = false;
    } catch (err) {
      console.error(err);
      statusEl.innerHTML = '<span style="color:var(--danger)">❌ Ошибка: ' + escapeHtml(err.message) + '</span>';
    } finally {
      scanBtn.disabled = false;
    }
  };

  function displayParsedTable(parsed) {
    const table = $('#aiParsedTable'), tbody = $('#aiParsedBody');
    if (!table || !tbody) return;
    table.hidden = false;
    tbody.innerHTML = '';
    for (const [grp, lessons] of Object.entries(parsed.groups || {})) {
      lessons.forEach((l, i) => {
        if (!l[0] && !l[1] && !l[2]) return;
        const tr = document.createElement('tr');
        tr.innerHTML = '<td><b>' + escapeHtml(grp) + '</b></td><td>' + (i + 1) + ' пара</td><td>' + escapeHtml(l[0] || '—') + '</td><td>' + escapeHtml(l[1] || '—') + '</td><td><b>' + escapeHtml(l[2] || '—') + '</b></td>';
        tbody.appendChild(tr);
      });
    }
  }

  applyBtn.onclick = () => {
    if (!aiParsedResult || !aiParsedResult.groups) return;
    const targetDay = aiParsedResult.day || 'Пн';
    for (const [grp, lsns] of Object.entries(aiParsedResult.groups)) {
      if (!schedule[grp]) schedule[grp] = {};
      schedule[grp][targetDay] = lsns;
    }
    scheduleMeta = {
      lastUpdated: new Date().toISOString(),
      date: aiParsedResult.date || '',
      day: targetDay,
      note: String(aiParsedResult.note || ('Изменения на ' + (aiParsedResult.date || targetDay))).replace(/\s*\([^)]*\)/g, '').trim()
    };
    saveCustomSchedule();
    localStorage.setItem('upk_schedule_meta', JSON.stringify(scheduleMeta));
    refreshGroupOptions();
    renderSchedule();
    renderRooms();
    updateScheduleNoteBanner();
    editorRows();
    statusEl.textContent = '✅ Изменения применены к расписанию для ' + Object.keys(aiParsedResult.groups).length + ' групп!';
  };

  publishBtn.onclick = async () => {
    if (!aiParsedResult || !aiParsedResult.groups) return;
    saveCreds();
    const repo = repoInput.value.trim(), token = tokenInput.value.trim();
    if (!repo || !token) {
      alert('Укажите GitHub Репозиторий и GitHub Token в блоке настроек!');
      return;
    }
    applyBtn.click();
    statusEl.textContent = '⏳ Публикация schedule.json на GitHub Pages...';
    publishBtn.disabled = true;

    try {
      const payload = { meta: scheduleMeta, schedule: schedule };
      const jsonContent = JSON.stringify(payload, null, 2);
      const base64Content = btoa(unescape(encodeURIComponent(jsonContent)));
      const branch = 'main';
      let sha = null;
      try {
        const checkRes = await fetch('https://api.github.com/repos/' + repo + '/contents/schedule.json?ref=' + branch, {
          headers: { 'Authorization': 'token ' + token, 'Accept': 'application/vnd.github+json' }
        });
        if (checkRes.ok) {
          const info = await checkRes.json();
          sha = info.sha;
        }
      } catch (_) {}

      const putRes = await fetch('https://api.github.com/repos/' + repo + '/contents/schedule.json', {
        method: 'PUT',
        headers: {
          'Authorization': 'token ' + token,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: '📅 ' + (scheduleMeta?.note || 'Обновление расписания по фото замен'),
          content: base64Content,
          branch: branch,
          ...(sha ? { sha } : {})
        })
      });

      if (!putRes.ok) throw new Error('Ошибка GitHub (' + putRes.status + '): ' + (await putRes.text()));
      const commitData = await putRes.json();
      statusEl.innerHTML = '🎉 ГОТОВО! Расписание опубликовано на GitHub Pages!<br><a href="' + (commitData.commit?.html_url || ('https://github.com/' + repo)) + '" target="_blank" style="color:var(--brand)">Посмотреть коммит на GitHub ↗</a>';
    } catch (err) {
      statusEl.textContent = '❌ Ошибка публикации: ' + err.message;
    } finally {
      publishBtn.disabled = false;
    }
  };
}


// --- Bento Grid 2.0 & Spotlight Telemetry Engine ---
function initSpotlight() {
  const cards = document.querySelectorAll('.card, .room-card, .schedule-card, .metric, .bento-stat-card, .method-card, .module-card');
  cards.forEach(card => {
    if (!card.classList.contains('spotlight-card')) card.classList.add('spotlight-card');
    card.onpointermove = e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
    };
  });
}

function showToast(text, type = 'info') {
  let box = document.getElementById('toastContainer');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toastContainer';
    box.className = 'toast-container';
    document.body.appendChild(box);
  }
  const toast = document.createElement('div');
  toast.className = 'toast-item toast-' + type;
  toast.innerHTML = '<span class="toast-dot"></span><span>' + escapeHtml(text) + '</span>';
  box.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function updateBentoTelemetry() {
  const groupSelect = $('#groupSelect');
  const groupBadge = $('#bentoGroupBadge');
  const countBadge = $('#bentoLessonsCount');
  const statusBadge = $('#bentoCallStatus');
  const modeBadge = $('#bentoScheduleMode');

  if (groupBadge && groupSelect) {
    groupBadge.textContent = groupSelect.value || '—';
  }

  if (countBadge) {
    const curGroup = groupSelect?.value;
    const curDay = days[selectedDay];
    const lessons = schedule[curGroup]?.[curDay] || [];
    const active = lessons.filter(l => l[0] || l[1] || l[2]);
    countBadge.textContent = active.length > 0 ? (active.length + ' пар(ы)') : 'Выходной';
  }

  if (statusBadge) {
    const bellStatus = getBentoCallStatus();
    statusBadge.textContent = bellStatus.short;
    statusBadge.title = bellStatus.full;
  }

  if (modeBadge) {
    if (scheduleMeta && scheduleMeta.note) {
      modeBadge.textContent = 'Актуальные замены';
      modeBadge.style.color = 'var(--brand)';
    } else {
      modeBadge.textContent = 'Семестровое';
      modeBadge.style.color = 'var(--ink)';
    }
  }
}
