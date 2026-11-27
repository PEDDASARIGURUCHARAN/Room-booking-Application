const rooms = [
  {id:"classic",name:"Classic Comfort",type:"Cozy & practical",price:2499,capacity:2,emoji:"🛏️",color:"#e8dfce",features:["Queen bed","City view","Free Wi-Fi"],tag:"GREAT VALUE"},
  {id:"deluxe",name:"Deluxe Retreat",type:"A little more luxury",price:3899,capacity:3,emoji:"🌿",color:"#dce9dc",features:["King bed","Garden view","Breakfast included"],tag:"POPULAR"},
  {id:"suite",name:"Signature Suite",type:"Room to spread out",price:5999,capacity:4,emoji:"🛋️",color:"#e8dce8",features:["Separate lounge","Premium view","Late checkout"],tag:"PREMIUM"}
];
const $ = id => document.getElementById(id);
const today = new Date(); const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);
const dateValue = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
$("checkin").min = dateValue(today); $("checkin").value = dateValue(today);
$("checkout").min = dateValue(tomorrow); $("checkout").value = dateValue(tomorrow);
$("checkin").addEventListener("change",()=>{const d=new Date($("checkin").value+"T00:00:00");d.setDate(d.getDate()+1);$("checkout").min=dateValue(d);if($("checkout").value<dateValue(d))$("checkout").value=dateValue(d)});
let selectedRoom = null;
function nights(){return Math.max(1,Math.round((new Date($("checkout").value+"T00:00:00")-new Date($("checkin").value+"T00:00:00"))/86400000))}
function renderRooms(){
  const guests=Number($("guests").value);
  $("roomGrid").innerHTML=rooms.filter(r=>r.capacity>=guests).map(r=>`
    <article class="room-card"><div class="room-visual" style="background:${r.color}"><span class="tag">${r.tag}</span><span class="emoji">${r.emoji}</span></div>
    <div class="room-info"><h3>${r.name}</h3><p class="muted">${r.type}</p><div class="room-meta"><span>♙ Up to ${r.capacity} guests</span><span>✦ ${r.features[0]}</span></div>
    <div class="room-bottom"><div class="price">₹${r.price.toLocaleString("en-IN")}<small> / night</small></div><button class="book-btn" data-book="${r.id}">Book room →</button></div></div></article>`).join("") || '<p class="empty-state">No rooms match that guest count. Try fewer guests.</p>';
  document.querySelectorAll("[data-book]").forEach(btn=>btn.addEventListener("click",()=>openBooking(btn.dataset.book)));
}
function getBookings(){return JSON.parse(localStorage.getItem("stayease-bookings")||"[]")}
function saveBookings(items){localStorage.setItem("stayease-bookings",JSON.stringify(items))}
function openBooking(id){
  selectedRoom=rooms.find(r=>r.id===id);$("selectedRoomId").value=id;
  $("dialogRoomName").textContent=selectedRoom.name;
  $("dialogSummary").textContent=`${nights()} night(s) · ${$("guests").value} guest(s) · Total ₹${(selectedRoom.price*nights()).toLocaleString("en-IN")}`;
  $("bookingDialog").showModal();
}
$("closeDialog").addEventListener("click",()=>$("bookingDialog").close());
$("bookingForm").addEventListener("submit",e=>{
  e.preventDefault();if(!$("bookingForm").reportValidity())return;
  const booking={id:Date.now().toString(),roomId:selectedRoom.id,room:selectedRoom.name,name:$("guestName").value.trim(),email:$("guestEmail").value.trim(),checkin:$("checkin").value,checkout:$("checkout").value,guests:Number($("guests").value),total:selectedRoom.price*nights()};
  const bookings=getBookings();bookings.unshift(booking);saveBookings(bookings);$("bookingDialog").close();$("bookingForm").reset();renderBookings();showToast("Your room has been booked. Enjoy your stay!");$("my-bookings").scrollIntoView({behavior:"smooth"});
});
function renderBookings(){
  const bookings=getBookings();
  $("bookingList").innerHTML=bookings.length?bookings.map(b=>`<article class="booking-item"><div><h3>${escapeHTML(b.room)} · ${escapeHTML(b.name)}</h3><p>${b.checkin} → ${b.checkout} · ${b.guests} guest(s) · ₹${Number(b.total).toLocaleString("en-IN")} · ${escapeHTML(b.email)}</p></div><button class="cancel-btn" data-cancel="${b.id}">Cancel booking</button></article>`).join(""):'<p class="empty-state">You haven\'t made any bookings yet.</p>';
  document.querySelectorAll("[data-cancel]").forEach(btn=>btn.addEventListener("click",()=>{if(confirm("Cancel this booking?")){saveBookings(getBookings().filter(b=>b.id!==btn.dataset.cancel));renderBookings();showToast("Booking cancelled.");}}));
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
let toastTimer;function showToast(msg){$("toast").textContent=msg;$("toast").classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("toast").classList.remove("show"),2800)}
$("searchBtn").addEventListener("click",()=>{if($("checkout").value<=$("checkin").value){showToast("Check-out must be after check-in.");return;}renderRooms();$("rooms").scrollIntoView({behavior:"smooth"});});
$("guests").addEventListener("change",renderRooms);
renderRooms();renderBookings();
