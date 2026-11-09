const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const KEY='descomplica-data-v1';
const uid=()=>Math.random().toString(36).slice(2,10);
const starter=()=>({tasks:[
{id:uid(),name:'Dar o osè de Exu',category:'Hábito',groupId:'religiao',done:false,expanded:false},
{id:uid(),name:'Verificar a quartinha',category:'Hábito',groupId:'religiao',done:false,expanded:false}
],groups:[{id:'religiao',name:'Religião',parentId:null}],notes:[],links:[]});
let data;try{data=JSON.parse(localStorage.getItem(KEY))||starter()}catch{data=starter()}
let currentView='organize',filter='Todas',selectedGroup=null,detailTab='Tarefas',pendingDelete=null;
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200)}
function groupName(id){return data.groups.find(g=>g.id===id)?.name||''}
function groupOptions(selected=''){return '<option value="">Sem grupo</option>'+data.groups.map(g=>`<option value="${g.id}" ${g.id===selected?'selected':''}>${esc(groupPath(g.id))}</option>`).join('')}
function groupPath(id){let g=data.groups.find(x=>x.id===id),parts=[];while(g){parts.unshift(g.name);g=data.groups.find(x=>x.id===g.parentId)}return parts.join(' / ')}
function switchView(v){currentView=v;$('#organizeView').hidden=v!=='organize';$('#groupsView').hidden=v!=='groups';$$('.tab,.bottom-item').forEach(b=>b.classList.toggle('active',b.dataset.view===v));if(v==='groups')renderGroups()}
$$('.tab,.bottom-item').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view)));
function renderTasks(){const list=$('#allTasks'),items=data.tasks.filter(t=>filter==='Todas'||t.category===filter);list.innerHTML=items.map(taskHTML).join('');$('#emptyTasks').hidden=items.length>0;wireTaskRows(list)}
function taskHTML(t){return `<article class="task-row" data-task="${t.id}"><div class="task-main"><input class="task-check" type="checkbox" ${t.done?'checked':''} aria-label="Concluir tarefa"><span class="task-title ${t.done?'done':''}">${esc(t.name)}</span><span class="pill">${esc(t.category)}</span><div class="task-actions"><button class="tiny-btn expand" aria-label="Detalhes">${t.expanded?'⌃':'⌄'}</button><button class="tiny-btn delete-task" aria-label="Excluir">⌫</button></div></div>${t.expanded?`<div class="task-extra"><label>Grupo<select class="move-task">${groupOptions(t.groupId||'')}</select></label><div class="row-actions"><button class="secondary delete-task">Excluir tarefa</button></div></div>`:''}</article>`}
function wireTaskRows(root){root.querySelectorAll('[data-task]').forEach(row=>{const id=row.dataset.task,t=data.tasks.find(x=>x.id===id);row.querySelector('.task-check').onchange=e=>{t.done=e.target.checked;save();renderAll()};row.querySelector('.expand').onclick=()=>{t.expanded=!t.expanded;renderAll()};row.querySelectorAll('.delete-task').forEach(b=>b.onclick=()=>askDelete('task',id,`Excluir a tarefa “${t.name}”?`));const sel=row.querySelector('.move-task');if(sel)sel.onchange=e=>{t.groupId||=null;t.groupId=e.target.value||null;save();renderAll();toast('Grupo atualizado') }})}
$$('#taskFilters .filter').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;$$('#taskFilters .filter').forEach(x=>x.classList.toggle('active',x===b));renderTasks()});
function openTask(groupId=null){$('#taskName').value='';$('#taskCategory').value='Hoje';$('#taskGroup').innerHTML=groupOptions(groupId||'');$('#taskDialogTitle').textContent='Nova tarefa';$('#taskDialog').showModal()}
$('#addQuick').onclick=()=>{if(!$('#quickTask').value.trim())return;openTask(null);$('#taskName').value=$('#quickTask').value.trim();$('#quickTask').value=''};
$('#quickTask').addEventListener('keydown',e=>{if(e.key==='Enter')$('#addQuick').click()});
$('#taskForm').onsubmit=e=>{if(e.submitter?.id!=='saveTask')return;e.preventDefault();const name=$('#taskName').value.trim();if(!name)return;data.tasks.unshift({id:uid(),name,category:$('#taskCategory').value,groupId:$('#taskGroup').value||null,done:false,expanded:false});save();$('#taskDialog').close();renderAll();toast('Tarefa adicionada')};
function renderGroups(){const roots=data.groups.filter(g=>!g.parentId);$('#groupTree').innerHTML=roots.map(g=>groupTreeHTML(g,0)).join('');$('#emptyGroups').hidden=data.groups.length>0;$('#groupTree').querySelectorAll('[data-open-group]').forEach(b=>b.onclick=()=>openGroup(b.dataset.openGroup));$('#groupTree').querySelectorAll('[data-delete-group]').forEach(b=>b.onclick=()=>askDelete('group',b.dataset.deleteGroup,'Excluir este grupo e seus subgrupos? As tarefas serão mantidas sem grupo.'));if(selectedGroup&&!data.groups.some(g=>g.id===selectedGroup)){selectedGroup=null;$('#groupDetail').hidden=true}else if(selectedGroup)renderGroupDetail()}
function groupTreeHTML(g,depth){const children=data.groups.filter(x=>x.parentId===g.id);const count=data.tasks.filter(t=>t.groupId===g.id).length;return `<div class="${depth?'subgroup':''}"><div class="group-card"><button class="group-open" data-open-group="${g.id}">▦ ${esc(g.name)}<small>${count} tarefa(s) · ${children.length} subgrupo(s)</small></button><button class="tiny-btn" data-delete-group="${g.id}" aria-label="Excluir grupo">⌫</button></div>${children.map(c=>groupTreeHTML(c,depth+1)).join('')}</div>`}
function openGroup(id){selectedGroup=id;detailTab='Tarefas';renderGroupDetail();$('#groupDetail').scrollIntoView({behavior:'smooth',block:'start'})}
function renderGroupDetail(){const g=data.groups.find(x=>x.id===selectedGroup);if(!g)return;const el=$('#groupDetail');el.hidden=false;const tabs=['Tarefas','Anotações','Subgrupos','Links/vídeos'];let body='';
if(detailTab==='Tarefas'){const tasks=data.tasks.filter(t=>t.groupId===g.id);body=`<div class="detail-toolbar"><button class="primary" id="groupAddTask">+ Tarefa</button></div>${tasks.length?tasks.map(taskHTML).join(''):'<div class="empty">Nenhuma tarefa neste grupo.</div>'}`}
if(detailTab==='Anotações'){const notes=data.notes.filter(n=>n.groupId===g.id);body=`<div class="detail-toolbar"><button class="primary" id="addNote">+ Anotação</button></div>${notes.length?notes.map(n=>`<article class="note-card"><strong>${esc(n.title||'Anotação')}</strong><p>${esc(n.body)}</p><div class="row-actions"><button class="tiny-btn" data-del-note="${n.id}">⌫ Excluir</button></div></article>`).join(''):'<div class="empty">Nenhuma anotação salva.</div>'}`}
if(detailTab==='Subgrupos'){const kids=data.groups.filter(x=>x.parentId===g.id);body=`<div class="detail-toolbar"><button class="primary" id="addSubgroup">+ Subgrupo</button></div>${kids.length?kids.map(c=>`<div class="group-card"><button class="group-open" data-open-group="${c.id}">▦ ${esc(c.name)}<small>Abrir subgrupo</small></button></div>`).join(''):'<div class="empty">Nenhum subgrupo criado.</div>'}`}
if(detailTab==='Links/vídeos'){const links=data.links.filter(l=>l.groupId===g.id);body=`<div class="detail-toolbar"><button class="primary" id="addLink">+ Link ou vídeo</button></div>${links.length?links.map(l=>`<article class="link-card"><strong>${esc(l.title||'Link salvo')}</strong><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.url)}</a><div class="row-actions"><button class="tiny-btn" data-del-link="${l.id}">⌫ Excluir</button></div></article>`).join(''):'<div class="empty">Nenhum link salvo.</div>'}`}
el.innerHTML=`<div class="detail-head"><div><h2>${esc(g.name)}</h2><p>${esc(groupPath(g.id))}</p></div><button class="tiny-btn" id="closeGroup">×</button></div><div class="detail-tabs">${tabs.map(t=>`<button class="detail-tab ${t===detailTab?'active':''}" data-detail-tab="${t}">${t}</button>`).join('')}</div><div class="detail-content">${body}</div>`;
el.querySelector('#closeGroup').onclick=()=>{selectedGroup=null;el.hidden=true};
el.querySelectorAll('[data-detail-tab]').forEach(b=>b.onclick=()=>{detailTab=b.dataset.detailTab;renderGroupDetail()});
if($('#groupAddTask'))$('#groupAddTask').onclick=()=>openTask(g.id);
if($('#addSubgroup'))$('#addSubgroup').onclick=()=>{openGroupDialog(g.id)};
if($('#addNote'))$('#addNote').onclick=()=>$('#noteDialog').showModal();
if($('#addLink'))$('#addLink').onclick=()=>$('#linkDialog').showModal();
wireTaskRows(el);
el.querySelectorAll('[data-open-group]').forEach(b=>b.onclick=()=>openGroup(b.dataset.openGroup));
el.querySelectorAll('[data-del-note]').forEach(b=>b.onclick=()=>askDelete('note',b.dataset.delNote,'Excluir esta anotação?'));
el.querySelectorAll('[data-del-link]').forEach(b=>b.onclick=()=>askDelete('link',b.dataset.delLink,'Excluir este link?'));
}
function openGroupDialog(parentId=null){$('#groupName').value='';$('#parentGroup').innerHTML='<option value="">Grupo principal</option>'+data.groups.map(g=>`<option value="${g.id}" ${g.id===parentId?'selected':''}>${esc(groupPath(g.id))}</option>`).join('');$('#groupDialog').showModal()}
$('#newGroupBtn').onclick=()=>openGroupDialog();
$('#groupForm').onsubmit=e=>{if(e.submitter?.id!=='saveGroup')return;e.preventDefault();const name=$('#groupName').value.trim();if(!name)return;const id=uid();data.groups.push({id,name,parentId:$('#parentGroup').value||null});save();$('#groupDialog').close();selectedGroup=id;renderAll();toast('Grupo criado')};
$('#noteForm').onsubmit=e=>{if(e.submitter?.id!=='saveNote')return;e.preventDefault();const body=$('#noteBody').value.trim();if(!body)return;data.notes.unshift({id:uid(),groupId:selectedGroup,title:$('#noteTitle').value.trim(),body});save();$('#noteDialog').close();$('#noteTitle').value='';$('#noteBody').value='';renderGroupDetail();toast('Anotação salva')};
$('#linkForm').onsubmit=e=>{if(e.submitter?.id!=='saveLink')return;e.preventDefault();const url=$('#linkUrl').value.trim();if(!url)return;data.links.unshift({id:uid(),groupId:selectedGroup,url,title:$('#linkTitle').value.trim()});save();$('#linkDialog').close();$('#linkUrl').value='';$('#linkTitle').value='';renderGroupDetail();toast('Link salvo')};
function askDelete(type,id,message){pendingDelete={type,id};$('#confirmText').textContent=message;$('#confirmDialog').showModal()}
$('#cancelDelete').onclick=()=>{$('#confirmDialog').close();pendingDelete=null};
$('#confirmDelete').onclick=()=>{if(!pendingDelete)return;const {type,id}=pendingDelete;if(type==='task')data.tasks=data.tasks.filter(x=>x.id!==id);if(type==='note')data.notes=data.notes.filter(x=>x.id!==id);if(type==='link')data.links=data.links.filter(x=>x.id!==id);if(type==='group'){const ids=new Set([id]);let changed=true;while(changed){changed=false;data.groups.forEach(g=>{if(ids.has(g.parentId)&&!ids.has(g.id)){ids.add(g.id);changed=true}})}data.groups=data.groups.filter(g=>!ids.has(g.id));data.tasks.forEach(t=>{if(ids.has(t.groupId))t.groupId=null});data.notes=data.notes.filter(n=>!ids.has(n.groupId));data.links=data.links.filter(l=>!ids.has(l.groupId));if(ids.has(selectedGroup))selectedGroup=null}save();$('#confirmDialog').close();pendingDelete=null;renderAll();toast('Item excluído')};
function renderAll(){renderTasks();renderGroups();$('#taskGroup').innerHTML=groupOptions($('#taskGroup').value||'')}
renderAll();
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#installBtn').hidden=false});
$('#installBtn').onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('#installBtn').hidden=true};
if('serviceWorker' in navigator && location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
