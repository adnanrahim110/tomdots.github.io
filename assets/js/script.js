function initHoverEffect(containerSelector) {
  const $container = $(containerSelector);
  const $authorImg = $container.find('.auhtor-img img');
  const $bookImg = $container.find('.book-img img');

  // Mousemove event for hover effect
  $container.on('mousemove', function (e) {
    const rect = $container[0].getBoundingClientRect();

    // Calculate cursor position relative to the container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate offsets (-50 to 50 range)
    let offsetX = ((x - centerX) / centerX) * 50; // X-axis offset
    let offsetY = ((y - centerY) / centerY) * 50; // Y-axis offset

    // Ensure author-img only moves in positive x and y directions
    offsetX = Math.max(0, offsetX); // Prevent negative X
    offsetY = Math.max(0, offsetY); // Prevent negative Y

    // Animate author image (translate effect)
    gsap.to($authorImg, {
      x: offsetX * 0.3, // Reduce sensitivity for slower movement
      y: offsetY * 0.3,
      duration: 3, // Slow down animation
      ease: 'power2.out',
    });

    // Animate book image (tilt effect)
    gsap.to($bookImg, {
      rotationX: -offsetY * 0.20, // Rotate around X-axis
      rotationY: offsetX * 0.20,  // Rotate around Y-axis
      duration: 3, // Slow down animation
      ease: 'power2.out',
    });
  });

  // Reset animations on mouse leave
  $container.on('mouseleave', function () {
    gsap.to($authorImg, {
      x: 0,
      y: 0,
      duration: 3, // Smooth reset
      ease: 'power2.out',
    });

    gsap.to($bookImg, {
      rotationX: 0,
      rotationY: 0,
      duration: 3, // Smooth reset
      ease: 'power2.out',
    });
  });
}

$(document).ready(function () {

  initHoverEffect('.book-left');

  let year = new Date().getFullYear();
  $('#year').text(year);

  // $('.form-control').on('focus', function () {
  //   $(this).siblings('.form-label').css({
  //     transform: 'translateY(10px)',
  //     transition: 'transform 0.3s ease',
  //     'font-size': '12px'
  //   });
  // });

  // $('.form-control').on('blur', function () {
  //   if ($(this).val().trim() === '') {
  //     $(this).siblings('.form-label').css({
  //       transform: 'translateY(30px)',
  //       'font-size': '14px'
  //     });
  //   }
  // });

  let lastScrollTop = 0;
  function initDynamicNavbar() {
    const $navbar = $('#navbar');

    $(window).on('scroll', function () {
      const currentScroll = $(window).scrollTop();

      if (currentScroll <= 0) {
        $navbar.removeClass('fixed hidden');
        $('#sticky-header').removeClass('sticky-header');
      }
      else if (currentScroll > 0 && currentScroll > lastScrollTop) {
        $navbar.addClass('fixed hidden');
        $('#sticky-header').addClass('sticky-header');
      } else if (currentScroll < lastScrollTop) {
        $navbar.removeClass('hidden');
      }

      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
  }

  $(document).ready(initDynamicNavbar);

  function initDynamicNav() {
    const $navLinks = $('.h-link');
    const currentPage = window.location.pathname.split('/').pop();

    $(window).on('scroll', () => {
      let activeFound = false;

      // Check each section's position
      $('section[id]').each(function () {
        const sectionTop = $(this).offset().top - 100; // Adjust threshold for activation
        const sectionBottom = sectionTop + $(this).outerHeight();

        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
          const id = $(this).attr('id');
          $navLinks.removeClass('active');
          $navLinks.filter(`[href="#${id}"]`).addClass('active');
          activeFound = true;
        }
      });

      // If no active section is found, default to the current page
      if (!activeFound) {
        $navLinks.removeClass('active');
        $navLinks.filter(`[href="${currentPage}"]`).addClass('active');
      }
    });

    // Smooth scroll for nav-links with hashes
    $navLinks.on('click', function (e) {
      const target = $(this).attr('href');

      if (target.startsWith('#')) {
        e.preventDefault();
        const offsetTop = $(target).offset()?.top || 0;

        $('html, body').animate({ scrollTop: offsetTop }, 500); // Smooth scroll
        $navLinks.removeClass('active');
        $(this).addClass('active');
      }
    });
  }

  $(document).ready(initDynamicNav);

  function initResponsiveNavbar() {
    const $hamburgerBtn = $('#hamburger-btn');
    const $body = $('body');
    const $sidebar = $('#sidebar');
    const $overlay = $('<div id="overlay"></div>'); // Create the overlay element

    // Add overlay to the body
    $overlay.css({
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 998, // Ensure it appears behind the sidebar
      display: 'none', // Initially hidden
    });
    $body.append($overlay);

    // Toggle sidebar
    $hamburgerBtn.on('click', () => {
      $sidebar.toggleClass('sidebar-open');
      $('main').toggleClass('trans-20');
      $('header').toggleClass('trans-20');
      $overlay.toggle($sidebar.hasClass('sidebar-open')); // Show/hide overlay
    });

    // Close sidebar when clicking outside or on overlay
    $overlay.on('click', () => {
      $sidebar.removeClass('sidebar-open');
      $('main').removeClass('trans-20');
      $('header').removeClass('trans-20');
      $overlay.hide();
    });

    $(document).on('click', (e) => {
      if (!$(e.target).closest('#sidebar, #hamburger-btn').length) {
        $sidebar.removeClass('sidebar-open');
        $('main').removeClass('trans-20');
        $('header').removeClass('trans-20');
        $overlay.hide();
      }
    });
  }

  $(document).ready(initResponsiveNavbar);

});

