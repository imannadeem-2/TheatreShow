/* ============================================================
TheatreShow.com — JavaScript

1. Mobile Nav (Hamburger)
2. Booking Modal
3. Booking Form Validation
4. Contact Form Validation
5. Language Tab Filter
6. Scroll Animations
7. Active Nav Highlight
   ============================================================ */

/* ============================================================

1. MOBILE NAV — Hamburger Toggle
   ============================================================ */

   var hamburger = document.getElementById('hamburger');
   var navLinks  = document.getElementById('navLinks');
   
   if (hamburger && navLinks) {
   hamburger.addEventListener('click', function () {
   hamburger.classList.toggle('open');
   navLinks.classList.toggle('open');
   });
   
   // Close nav when a link is clicked
   navLinks.querySelectorAll('a').forEach(function (link) {
   link.addEventListener('click', function () {
   hamburger.classList.remove('open');
   navLinks.classList.remove('open');
   });
   });
   }
   
   /* ============================================================
   2. BOOKING MODAL
   ============================================================ */
   
   var selectedPrice = 0;
   var ticketQty = 1;
   
   /**
   
   * Opens the booking modal for a specific show.
     */
     function openBooking(showName) {
     document.getElementById('modal-show-name').textContent = showName;
     document.getElementById('modal-show-details').textContent =
     'Select your preferred date and seat category';
   
   document.getElementById('bookingModal').classList.add('active');
   document.body.style.overflow = 'hidden';
   
   document.getElementById('success-msg').style.display = 'none';
   document.getElementById('booking-form-content').style.display = 'block';
   
   resetBookingForm();
   }
   
   /**
   
   * Closes the booking modal.
     */
     function closeBooking() {
     document.getElementById('bookingModal').classList.remove('active');
     document.body.style.overflow = '';
     }
   
   /**
   
   * Resets all booking form fields.
     */
     function resetBookingForm() {
     selectedPrice = 0;
     ticketQty = 1;
   
   document.getElementById('qty-display').textContent = '1';
   document.getElementById('total-display').textContent = 'Rs 0';
   
   document.getElementById('b-name').value = '';
   document.getElementById('b-email').value = '';
   document.getElementById('b-phone').value = '';
   document.getElementById('b-date').value = '';
   
   document.querySelectorAll('.seat-type').forEach(function (el) {
   el.classList.remove('selected');
   el.setAttribute('aria-pressed', 'false');
   });
   
   clearBookingErrors();
   
   // Minimum date = today
   var today = new Date().toISOString().split('T')[0];
   document.getElementById('b-date').setAttribute('min', today);
   }
   
   // Close modal when clicking dark backdrop
   var bookingModal = document.getElementById('bookingModal');
   if (bookingModal) {
   bookingModal.addEventListener('click', function (e) {
   if (e.target === this) closeBooking();
   });
   }
   
   // Close on Escape key
   document.addEventListener('keydown', function (e) {
   if (e.key === 'Escape') {
   var modal = document.getElementById('bookingModal');
   if (modal && modal.classList.contains('active')) {
   closeBooking();
   }
   }
   });
   
   /* ── Seat Selection ── */
   
   function selectSeat(el, price) {
   document.querySelectorAll('.seat-type').forEach(function (s) {
   s.classList.remove('selected');
   s.setAttribute('aria-pressed', 'false');
   });
   
   el.classList.add('selected');
   el.setAttribute('aria-pressed', 'true');
   selectedPrice = price;
   
   // clear seat error when seat selected
   var seatErr = document.getElementById('err-seat');
   if (seatErr) {
   seatErr.textContent = '';
   seatErr.classList.remove('show');
   }
   
   updateTotal();
   }
   
   // Keyboard support for seat buttons
   document.querySelectorAll('.seat-type').forEach(function (el) {
   el.addEventListener('keydown', function (e) {
   if (e.key === 'Enter' || e.key === ' ') {
   e.preventDefault();
   
     var priceText = el.querySelector('.sprice').textContent;
     var price = parseInt(priceText.replace(/[^\d]/g, ''), 10);
   
     selectSeat(el, price);
   }
   
   });
   });
   
   /* ── Ticket Quantity ── */
   
   function changeQty(delta) {
   ticketQty += delta;
   
   if (ticketQty < 1) ticketQty = 1;
   if (ticketQty > 10) ticketQty = 10;
   
   document.getElementById('qty-display').textContent = ticketQty;
   updateTotal();
   }
   
   function updateTotal() {
   if (selectedPrice > 0) {
   var total = selectedPrice * ticketQty;
   document.getElementById('total-display').textContent = 'Rs ' + total.toLocaleString();
   } else {
   document.getElementById('total-display').textContent = 'Rs 0';
   }
   }
   
   /* ============================================================
   3. BOOKING FORM VALIDATION
   ============================================================ */
   
   function confirmBooking() {
   clearBookingErrors();
   
   var name  = document.getElementById('b-name').value.trim();
   var email = document.getElementById('b-email').value.trim();
   var phone = document.getElementById('b-phone').value.trim();
   var date  = document.getElementById('b-date').value;
   
   var hasError = false;
   
   // Name validation
   if (!name) {
   showBookingError('b-name', 'err-name', 'Please enter your full name.');
   hasError = true;
   } else if (name.length < 5) {
   showBookingError('b-name', 'err-name', 'Name must be at least 5  characters.');
   hasError = true;
   }
   
   // Email validation
   if (!email) {
   showBookingError('b-email', 'err-email', 'Please enter your email address.');
   hasError = true;
   } else if (!isValidEmail(email)) {
   showBookingError('b-email', 'err-email', 'Please enter a valid email (e.g. you@email.com).');
   hasError = true;
   }
   
   // Phone validation (optional)
   if (phone && !isValidPhone(phone)) {
   showBookingError('b-phone', 'err-phone', 'Please enter a valid phone number (7–15 digits).');
   hasError = true;
   }
   
   // Date validation
   if (!date) {
   showBookingError('b-date', 'err-date', 'Please select a performance date.');
   hasError = true;
   }
   
   // Seat validation
   if (selectedPrice === 0) {
   var seatErr = document.getElementById('err-seat');
   if (seatErr) {
   seatErr.textContent = 'Please select a seat category (VIP, Regular, or Economy).';
   seatErr.classList.add('show');
   }
   hasError = true;
   }
   
   if (hasError) return;
   
   // Save data in Local Storage
   var bookingData = {
   showName: document.getElementById('modal-show-name').textContent,
   customerName: name,
   email: email,
   phone: phone,
   performanceDate: date,
   tickets: ticketQty,
   totalAmount: selectedPrice * ticketQty
   };
   
   localStorage.setItem('bookingData', JSON.stringify(bookingData));
   
   // Show success message
   document.getElementById('booking-form-content').style.display = 'none';
   document.getElementById('success-msg').style.display = 'block';
   }
   
   function showBookingError(fieldId, errorId, message) {
   var field = document.getElementById(fieldId);
   var error = document.getElementById(errorId);
   
   if (field) field.classList.add('error');
   
   if (error) {
   error.textContent = message;
   error.classList.add('show');
   }
   }
   
   function clearBookingErrors() {
   ['b-name', 'b-email', 'b-phone', 'b-date'].forEach(function (id) {
   var el = document.getElementById(id);
   if (el) el.classList.remove('error');
   });
   
   ['err-name', 'err-email', 'err-phone', 'err-date', 'err-seat'].forEach(function (id) {
   var el = document.getElementById(id);
   if (el) {
   el.textContent = '';
   el.classList.remove('show');
   }
   });
   }
   
   /* ── BOOKING LIVE VALIDATION ── */
   
   // Name
   var bName = document.getElementById('b-name');
   if (bName) {
   bName.addEventListener('input', function () {
   var value = this.value.trim();
   
   if (!value) {
     this.classList.remove('error');
     document.getElementById('err-name').textContent = '';
     document.getElementById('err-name').classList.remove('show');
     return;
   }
   
   if (value.length < 3) {
     showBookingError('b-name', 'err-name', 'Name must be at least 3 characters.');
   } else {
     this.classList.remove('error');
     document.getElementById('err-name').textContent = '';
     document.getElementById('err-name').classList.remove('show');
   }
   
   });
   }
   
   // Email
   var bEmail = document.getElementById('b-email');
   if (bEmail) {
   bEmail.addEventListener('input', function () {
   var value = this.value.trim();
   
   if (!value) {
     this.classList.remove('error');
     document.getElementById('err-email').textContent = '';
     document.getElementById('err-email').classList.remove('show');
     return;
   }
   
   if (!isValidEmail(value)) {
     showBookingError('b-email', 'err-email', 'Please enter a valid email.');
   } else {
     this.classList.remove('error');
     document.getElementById('err-email').textContent = '';
     document.getElementById('err-email').classList.remove('show');
   }
   
   });
   }
   
   // Phone
   var bPhone = document.getElementById('b-phone');
   if (bPhone) {
   bPhone.addEventListener('input', function () {
   var value = this.value.trim();
   
   if (!value) {
     this.classList.remove('error');
     document.getElementById('err-phone').textContent = '';
     document.getElementById('err-phone').classList.remove('show');
     return;
   }
   
   if (!isValidPhone(value)) {
     showBookingError('b-phone', 'err-phone', 'Please enter a valid phone number.');
   } else {
     this.classList.remove('error');
     document.getElementById('err-phone').textContent = '';
     document.getElementById('err-phone').classList.remove('show');
   }
   
   });
   }
   
   // Date
   var bDate = document.getElementById('b-date');
   if (bDate) {
   bDate.addEventListener('change', function () {
   if (!this.value) {
   showBookingError('b-date', 'err-date', 'Please select a date.');
   } else {
   this.classList.remove('error');
   document.getElementById('err-date').textContent = '';
   document.getElementById('err-date').classList.remove('show');
   }
   });
   }
   
   /* ============================================================
   4. CONTACT / FEEDBACK FORM VALIDATION
   ============================================================ */
   
   function submitContactForm(event) {
   event.preventDefault();
   clearContactErrors();
   
   var firstName = document.getElementById('c-first').value.trim();
   var lastName  = document.getElementById('c-last').value.trim();
   var email     = document.getElementById('c-email').value.trim();
   var phone     = document.getElementById('c-phone').value.trim();
   var subject   = document.getElementById('c-subject').value;
   var message   = document.getElementById('c-message').value.trim();
   
   var hasError = false;
   
   // First Name
   if (!firstName) {
   showContactError('c-first', 'cerr-first', 'First name is required.');
   hasError = true;
   } else if (firstName.length < 2) {
   showContactError('c-first', 'cerr-first', 'First name must be at least 2 characters.');
   hasError = true;
   }
   
   // Last Name
   if (!lastName) {
   showContactError('c-last', 'cerr-last', 'Last name is required.');
   hasError = true;
   } else if (lastName.length < 2) {
   showContactError('c-last', 'cerr-last', 'Last name must be at least 2 characters.');
   hasError = true;
   }
   
   // Email
   if (!email) {
   showContactError('c-email', 'cerr-email', 'Email address is required.');
   hasError = true;
   } else if (!isValidEmail(email)) {
   showContactError('c-email', 'cerr-email', 'Please enter a valid email (e.g. you@example.com).');
   hasError = true;
   }
   
   // Phone (optional)
   if (phone && !isValidPhone(phone)) {
   showContactError('c-phone', 'cerr-phone', 'Please enter a valid phone number (7–15 digits).');
   hasError = true;
   }
   
   // Subject
   if (!subject) {
   showContactError('c-subject', 'cerr-subject', 'Please select a subject.');
   hasError = true;
   }
   
   // Message
   if (!message) {
   showContactError('c-message', 'cerr-message', 'Please write a message before sending.');
   hasError = true;
   } else if (message.length < 10) {
   showContactError('c-message', 'cerr-message', 'Message is too short. Please write at least 10 characters.');
   hasError = true;
   }
   
   if (hasError) return;
   
   // Success feedback
   var btn = document.getElementById('contact-submit-btn');
   var successDiv = document.getElementById('contactSuccess');
   
   btn.textContent = '✓ Message Sent!';
   btn.style.background = '#2A6A2A';
   btn.disabled = true;
   
   if (successDiv) successDiv.style.display = 'block';
   
   setTimeout(function () {
   btn.textContent = 'Send Message';
   btn.style.background = '';
   btn.disabled = false;
   
   if (successDiv) successDiv.style.display = 'none';
   
   document.getElementById('contactForm').reset();
   
   }, 4000);
   }
   
   function showContactError(fieldId, errorId, message) {
   var field = document.getElementById(fieldId);
   var error = document.getElementById(errorId);
   
   if (field) field.classList.add('error');
   
   if (error) {
   error.textContent = message;
   error.classList.add('show');
   }
   }
   
   function clearContactErrors() {
   ['c-first', 'c-last', 'c-email', 'c-phone', 'c-subject', 'c-message'].forEach(function (id) {
   var el = document.getElementById(id);
   if (el) el.classList.remove('error');
   });
   
   ['cerr-first', 'cerr-last', 'cerr-email', 'cerr-phone', 'cerr-subject', 'cerr-message'].forEach(function (id) {
   var el = document.getElementById(id);
   if (el) {
   el.textContent = '';
   el.classList.remove('show');
   }
   });
   }
   
   /* ── CONTACT LIVE VALIDATION ── */
   
   // First Name
   var cFirst = document.getElementById('c-first');

if (cFirst) {
  cFirst.addEventListener('input', function () {
    // Sirf alphabets aur spaces allow
    this.value = this.value.replace(/[^A-Za-z\s]/g, '');

    var value = this.value.trim();
    var errFirst = document.getElementById('cerr-first');

    if (!value) {
      this.classList.remove('error');
      errFirst.textContent = '';
      errFirst.classList.remove('show');
      return;
    }

    if (value.length < 2) {
      showContactError('c-first', 'cerr-first', 'First name must be at least 2 characters.');
    } else {
      this.classList.remove('error');
      errFirst.textContent = '';
      errFirst.classList.remove('show');
    }
  });
}
   
   // Last Name
   var cLast = document.getElementById('c-last');

if (cLast) {
  cLast.addEventListener('input', function () {
    // Sirf alphabets aur spaces allow
    this.value = this.value.replace(/[^A-Za-z\s]/g, '');

    var value = this.value.trim();
    var errLast = document.getElementById('cerr-last');

    if (!value) {
      this.classList.remove('error');
      errLast.textContent = '';
      errLast.classList.remove('show');
      return;
    }

    if (value.length < 2) {
      showContactError('c-last', 'cerr-last', 'Last name must be at least 2 characters.');
    } else {
      this.classList.remove('error');
      errLast.textContent = '';
      errLast.classList.remove('show');
    }
  });
}
   
   // Contact Email
   var cEmail = document.getElementById('c-email');
   if (cEmail) {
   cEmail.addEventListener('input', function () {
   var value = this.value.trim();
   
   if (!value) {
     this.classList.remove('error');
     document.getElementById('cerr-email').textContent = '';
     document.getElementById('cerr-email').classList.remove('show');
     return;
   }
   
   if (!isValidEmail(value)) {
     showContactError('c-email', 'cerr-email', 'Please enter a valid email.');
   } else {
     this.classList.remove('error');
     document.getElementById('cerr-email').textContent = '';
     document.getElementById('cerr-email').classList.remove('show');
   }
   
   });
   }
   
   // Contact Phone
   var cPhone = document.getElementById('c-phone');

if (cPhone) {
  cPhone.addEventListener('input', function () {
    // Sirf numbers allow
    this.value = this.value.replace(/\D/g, '');

    var value = this.value.trim();

    if (!value) {
      this.classList.remove('error');
      document.getElementById('cerr-phone').textContent = '';
      document.getElementById('cerr-phone').classList.remove('show');
      return;
    }

    if (!isValidPhone(value)) {
      showContactError('c-phone', 'cerr-phone', '.');
    } else {
      this.classList.remove('error');
      document.getElementById('cerr-phone').textContent = '';
      document.getElementById('cerr-phone').classList.remove('show');
    }
  });
}

function isValidPhone(phone) {
  return /^\d{7,15}$/.test(phone);
}
   
   // Subject
   var cSubject = document.getElementById('c-subject');
   if (cSubject) {
   cSubject.addEventListener('change', function () {
   if (!this.value) {
   showContactError('c-subject', 'cerr-subject', 'Please select a subject.');
   } else {
   this.classList.remove('error');
   document.getElementById('cerr-subject').textContent = '';
   document.getElementById('cerr-subject').classList.remove('show');
   }
   });
   }
   
   // Message
   var cMessage = document.getElementById('c-message');
   if (cMessage) {
   cMessage.addEventListener('input', function () {
   var value = this.value.trim();
   
   if (!value) {
     this.classList.remove('error');
     document.getElementById('cerr-message').textContent = '';
     document.getElementById('cerr-message').classList.remove('show');
     return;
   }
   
   if (value.length < 10) {
     showContactError('c-message', 'cerr-message', 'Message is too short. Please write at least 10 characters.');
   } else {
     this.classList.remove('error');
     document.getElementById('cerr-message').textContent = '';
     document.getElementById('cerr-message').classList.remove('show');
   }
   
   });
   }
   
   /* ── Helpers ── */
   
   function isValidEmail(email) {
   return /^[^\s@]+@[^\s@]+.[^\s@]+$/.test(email);
   }
   
   function isValidPhone(phone) {
   return /^[\d\s+-]{7,15}$/.test(phone);
   }
   
   /* ============================================================
   5. LANGUAGE TAB FILTER
   ============================================================ */
   
   document.querySelectorAll('.lang-tab').forEach(function (tab) {
   tab.addEventListener('click', function () {
   document.querySelectorAll('.lang-tab').forEach(function (t) {
   t.classList.remove('active');
   });
   
   this.classList.add('active');
   
   var selectedLang = this.getAttribute('data-lang');
   var allShows = document.querySelectorAll('.show-item');
   var visibleCount = 0;
   
   allShows.forEach(function (card) {
     if (selectedLang === 'all' || card.getAttribute('data-lang') === selectedLang) {
       card.classList.remove('hidden');
   
       // Re-trigger fade animation
       card.style.animation = 'none';
       card.offsetHeight;
       card.style.animation = 'fadeUp 0.4s ease both';
       card.style.opacity = '1';
   
       visibleCount++;
     } else {
       card.classList.add('hidden');
     }
   });
   
   var noShows = document.getElementById('noShows');
   if (noShows) {
     noShows.style.display = (visibleCount === 0) ? 'block' : 'none';
   }
   
   });
   });
   
   /* ============================================================
   6. SCROLL ANIMATIONS
   ============================================================ */
   
   var animatedElements = document.querySelectorAll(
   '.show-item, .audi-card, .artist-card, .award-card, .review-card, .mag-card, .upcoming-item'
   );
   
   if (animatedElements.length > 0) {
   var fadeObserver = new IntersectionObserver(function (entries) {
   entries.forEach(function (entry) {
   if (entry.isIntersecting) {
   entry.target.style.animation = 'fadeUp 0.6s ease both';
   entry.target.style.opacity = '1';
   fadeObserver.unobserve(entry.target);
   }
   });
   }, { threshold: 0.08 });
   
   animatedElements.forEach(function (el) {
   el.style.opacity = '0';
   fadeObserver.observe(el);
   });
   }
   
   /* ============================================================
   7. ACTIVE NAV HIGHLIGHT
   ============================================================ */
   
   var sections = document.querySelectorAll('section[id]');
   var navLinkEls = document.querySelectorAll('.nav-links a');
   
   window.addEventListener('scroll', function () {
   var scrollY = window.scrollY;
   var currentSection = '';
   
   sections.forEach(function (section) {
   if (scrollY >= section.offsetTop - 120) {
   currentSection = section.getAttribute('id');
   }
   });
   
   navLinkEls.forEach(function (link) {
   if (link.getAttribute('href') === '#' + currentSection) {
   link.style.color = 'var(--pale-gold)';
   } else {
   link.style.color = '';
   }
   });
   });
