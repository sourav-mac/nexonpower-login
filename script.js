document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  const signUpBtn = document.getElementById('signUpBtn');
  const signInBtn = document.getElementById('signInBtn');
  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');
  const toast = document.getElementById('toast');

  const tabSignInBtn = document.getElementById('tabSignInBtn');
  const tabSignUpBtn = document.getElementById('tabSignUpBtn');
  const linkToSignUp = document.getElementById('linkToSignUp');
  const linkToSignIn = document.getElementById('linkToSignIn');

  function updateMobileTabs(activePanel) {
    if (!tabSignInBtn || !tabSignUpBtn) return;
    if (activePanel === 'signUp') {
      tabSignUpBtn.classList.add('active');
      tabSignUpBtn.setAttribute('aria-selected', 'true');
      tabSignInBtn.classList.remove('active');
      tabSignInBtn.setAttribute('aria-selected', 'false');
    } else {
      tabSignInBtn.classList.add('active');
      tabSignInBtn.setAttribute('aria-selected', 'true');
      tabSignUpBtn.classList.remove('active');
      tabSignUpBtn.setAttribute('aria-selected', 'false');
    }
  }

  function switchToSignUp() {
    container.classList.add('right-panel-active');
    updateMobileTabs('signUp');
    drawCaptcha('signUp');
  }

  function switchToSignIn() {
    container.classList.remove('right-panel-active');
    updateMobileTabs('signIn');
    drawCaptcha('signIn');
  }

  // Slide to Sign Up (Create Account / Account Setup)
  if (signUpBtn) signUpBtn.addEventListener('click', switchToSignUp);
  if (tabSignUpBtn) tabSignUpBtn.addEventListener('click', switchToSignUp);
  if (linkToSignUp) linkToSignUp.addEventListener('click', switchToSignUp);

  // Slide to Sign In (Login)
  if (signInBtn) signInBtn.addEventListener('click', switchToSignIn);
  if (tabSignInBtn) tabSignInBtn.addEventListener('click', switchToSignIn);
  if (linkToSignIn) linkToSignIn.addEventListener('click', switchToSignIn);

  // Toggle Password Visibility
  const toggleButtons = document.querySelectorAll('.toggle-password');
  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const passwordInput = this.parentElement.querySelector('input');
      const eyeOpen = this.querySelector('.eye-open');
      const eyeClosed = this.querySelector('.eye-closed');

      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeOpen.classList.add('hidden');
        eyeClosed.classList.remove('hidden');
      } else {
        passwordInput.type = 'password';
        eyeOpen.classList.remove('hidden');
        eyeClosed.classList.add('hidden');
      }
    });
  });

  // Helper function to show toast messages
  let toastTimer;
  function showToast(message, type = 'info') {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // --- Multi-Step Wizard Logic (5 Steps) ---
  let currentStep = 1;
  const totalSteps = 5;
  const wizardNavRow = document.getElementById('wizardNavRow');
  const btnStepPrev = document.getElementById('btnStepPrev');
  const btnStepNext = document.getElementById('btnStepNext');
  const btnStepSubmit = document.getElementById('btnStepSubmit');

  function updateWizardView() {
    // Update step indicators
    document.querySelectorAll('.step-item').forEach((item) => {
      const step = parseInt(item.getAttribute('data-step'), 10);
      item.classList.remove('active', 'completed');
      if (step === currentStep) {
        item.classList.add('active');
      } else if (step < currentStep) {
        item.classList.add('completed');
      }
    });

    // Update step panels
    document.querySelectorAll('.step-panel').forEach((panel, idx) => {
      if (idx + 1 === currentStep) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Toggle Back button and center Continue button on Step 1
    if (currentStep > 1) {
      btnStepPrev.classList.remove('hidden');
      if (wizardNavRow) wizardNavRow.classList.add('has-prev');
    } else {
      btnStepPrev.classList.add('hidden');
      if (wizardNavRow) wizardNavRow.classList.remove('has-prev');
    }

    // Toggle Continue vs Submit button
    if (currentStep === totalSteps) {
      btnStepNext.classList.add('hidden');
      btnStepSubmit.classList.remove('hidden');
    } else {
      btnStepNext.classList.remove('hidden');
      btnStepSubmit.classList.add('hidden');
    }
  }

  // --- Strict Multi-Step Form Validation Engine ---
  function validateStep(step) {
    if (step === 1) {
      const selectedAccount = document.querySelector('input[name="accountType"]:checked');
      if (!selectedAccount) {
        showToast('Please select an account type', 'error');
        return false;
      }
      return true;
    }

    if (step === 2) {
      const firstNameEl = document.getElementById('stepFirstName');
      const emailEl = document.getElementById('stepEmail');
      const phoneEl = document.getElementById('stepPhone');
      const passwordEl = document.getElementById('stepPassword');
      const confirmPasswordEl = document.getElementById('stepConfirmPassword');

      const firstName = firstNameEl ? firstNameEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const phone = phoneEl ? phoneEl.value.trim().replace(/\D/g, '') : '';
      const password = passwordEl ? passwordEl.value : '';
      const confirmPassword = confirmPasswordEl ? confirmPasswordEl.value : '';

      if (!firstName) {
        showToast('Please enter your first name', 'error');
        if (firstNameEl) firstNameEl.focus();
        return false;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!email) {
        showToast('Please enter your email address', 'error');
        if (emailEl) emailEl.focus();
        return false;
      }
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address (e.g. name@company.com)', 'error');
        if (emailEl) emailEl.focus();
        return false;
      }

      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phone) {
        showToast('Please enter your mobile phone number', 'error');
        if (phoneEl) phoneEl.focus();
        return false;
      }
      if (!phoneRegex.test(phone)) {
        showToast('Please enter a valid 10-digit mobile number', 'error');
        if (phoneEl) phoneEl.focus();
        return false;
      }

      if (!password) {
        showToast('Please create a password', 'error');
        if (passwordEl) passwordEl.focus();
        return false;
      }
      if (password.length < 6) {
        showToast('Password must be at least 6 characters long', 'error');
        if (passwordEl) passwordEl.focus();
        return false;
      }

      if (!confirmPassword) {
        showToast('Please confirm your password', 'error');
        if (confirmPasswordEl) confirmPasswordEl.focus();
        return false;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match. Please re-enter.', 'error');
        if (confirmPasswordEl) confirmPasswordEl.focus();
        return false;
      }

      return true;
    }

    if (step === 3) {
      const orgNameEl = document.getElementById('orgName');
      const orgTypeEl = document.getElementById('orgType');
      const billStreetEl = document.getElementById('billingStreet1');
      const billCityEl = document.getElementById('billingCity');
      const billDistEl = document.getElementById('billingDistrict');
      const billStateEl = document.getElementById('billingState');
      const billPinEl = document.getElementById('billingPincode');
      const panEl = document.getElementById('orgPan');
      const shipPinEl = document.getElementById('shippingPincode');

      const orgName = orgNameEl ? orgNameEl.value.trim() : '';
      const orgType = orgTypeEl ? orgTypeEl.value.trim() : '';
      const billStreet = billStreetEl ? billStreetEl.value.trim() : '';
      const billCity = billCityEl ? billCityEl.value.trim() : '';
      const billDist = billDistEl ? billDistEl.value.trim() : '';
      const billState = billStateEl ? billStateEl.value.trim() : '';
      const billPin = billPinEl ? billPinEl.value.trim() : '';
      const panVal = panEl ? panEl.value.trim().toUpperCase() : '';
      const shipPin = shipPinEl ? shipPinEl.value.trim() : '';

      if (!orgName) {
        showToast('Please enter your organization name', 'error');
        if (orgNameEl) orgNameEl.focus();
        return false;
      }
      if (!orgType) {
        showToast('Please select your organization type', 'error');
        if (orgTypeEl) orgTypeEl.focus();
        return false;
      }
      if (panVal && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panVal)) {
        showToast('Please enter a valid 10-digit PAN (e.g. ABCDE1234F)', 'error');
        if (panEl) panEl.focus();
        return false;
      }
      if (!billStreet) {
        showToast('Please enter your billing street address', 'error');
        if (billStreetEl) billStreetEl.focus();
        return false;
      }
      if (!billCity) {
        showToast('Please enter your billing city', 'error');
        if (billCityEl) billCityEl.focus();
        return false;
      }
      if (!billDist) {
        showToast('Please enter your billing district', 'error');
        if (billDistEl) billDistEl.focus();
        return false;
      }
      if (!billState) {
        showToast('Please enter or select your billing state', 'error');
        if (billStateEl) billStateEl.focus();
        return false;
      }
      if (!billPin || !/^\d{6}$/.test(billPin)) {
        showToast('Please enter a valid 6-digit billing pincode', 'error');
        if (billPinEl) billPinEl.focus();
        return false;
      }
      if (shipPin && !/^\d{6}$/.test(shipPin)) {
        showToast('Shipping Pincode must be exactly 6 digits', 'error');
        if (shipPinEl) shipPinEl.focus();
        return false;
      }

      return true;
    }

    if (step === 4) {
      const metersEl = document.getElementById('subNumMeters');
      const gatewaysEl = document.getElementById('subNumGateways');
      const usersEl = document.getElementById('subNumUsers');

      const meters = metersEl ? parseInt(metersEl.value, 10) : 0;
      const gateways = gatewaysEl ? parseInt(gatewaysEl.value, 10) : 0;
      const users = usersEl ? parseInt(usersEl.value, 10) : 0;

      if (isNaN(meters) || meters < 1) {
        showToast('Number of Meters must be at least 1', 'error');
        if (metersEl) metersEl.focus();
        return false;
      }
      if (isNaN(gateways) || gateways < 1) {
        showToast('Number of Gateways must be at least 1', 'error');
        if (gatewaysEl) gatewaysEl.focus();
        return false;
      }
      if (isNaN(users) || users < 1) {
        showToast('Number of Users must be at least 1', 'error');
        if (usersEl) usersEl.focus();
        return false;
      }
      return true;
    }

    return true;
  }

  // Next Step Action
  btnStepNext.addEventListener('click', () => {
    if (!validateStep(currentStep)) {
      return;
    }
    if (currentStep < totalSteps) {
      currentStep++;
      updateWizardView();
    }
  });

  // Numeric Only & Sanitizers
  const stepPhoneInput = document.getElementById('stepPhone');
  if (stepPhoneInput) {
    stepPhoneInput.addEventListener('input', () => {
      stepPhoneInput.value = stepPhoneInput.value.replace(/\D/g, '').slice(0, 10);
    });
  }

  // Pincode Numeric Only (Billing & Shipping)
  ['billingPincode', 'shippingPincode'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.value = el.value.replace(/\D/g, '').slice(0, 6);
      });
    }
  });

  // PAN Uppercase & Alphanumeric Only
  const panInput = document.getElementById('orgPan');
  if (panInput) {
    panInput.addEventListener('input', () => {
      panInput.value = panInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    });
  }

  // Previous Step Action
  btnStepPrev.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateWizardView();
    }
  });

  // Interactive Account Type card selector (Step 1)
  const accountCards = document.querySelectorAll('.account-card');
  accountCards.forEach((card) => {
    card.addEventListener('click', () => {
      accountCards.forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // Interactive Subscription Duration selector (Step 4)
  const durationPills = document.querySelectorAll('.duration-pill');
  durationPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      durationPills.forEach((p) => p.classList.remove('selected'));
      pill.classList.add('selected');
      const radio = pill.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Step 4: Number Stepper Buttons (+ / -)
  document.querySelectorAll('.stepper-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      let currentVal = parseInt(input.value, 10);
      if (isNaN(currentVal) || currentVal < 1) currentVal = 1;

      const isInc = btn.classList.contains('btn-step-inc');
      const isDec = btn.classList.contains('btn-step-dec');

      if (isInc) {
        input.value = currentVal + 1;
      } else if (isDec && currentVal > 1) {
        input.value = currentVal - 1;
      }

      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  // Ensure manual stepper typing doesn't leave 0 or negative
  document.querySelectorAll('.stepper-input').forEach((input) => {
    input.addEventListener('blur', () => {
      let val = parseInt(input.value, 10);
      if (isNaN(val) || val < 1) {
        input.value = 1;
      }
    });
  });

  // "Copy from Billing" Address Copy Action (Step 3)
  const copyBillingBtn = document.getElementById('copyBillingBtn');
  const addressFieldPairs = [
    { billing: 'billingStreet1', shipping: 'shippingStreet1' },
    { billing: 'billingStreet2', shipping: 'shippingStreet2' },
    { billing: 'billingCity', shipping: 'shippingCity' },
    { billing: 'billingDistrict', shipping: 'shippingDistrict' },
    { billing: 'billingState', shipping: 'shippingState' },
    { billing: 'billingCountry', shipping: 'shippingCountry' },
    { billing: 'billingPincode', shipping: 'shippingPincode' },
    { billing: 'billingLandmark', shipping: 'shippingLandmark' }
  ];

  if (copyBillingBtn) {
    copyBillingBtn.addEventListener('click', () => {
      let copiedCount = 0;
      addressFieldPairs.forEach((pair) => {
        const billingEl = document.getElementById(pair.billing);
        const shippingEl = document.getElementById(pair.shipping);
        if (billingEl && shippingEl) {
          shippingEl.value = billingEl.value;
          if (billingEl.value.trim() !== '') copiedCount++;
        }
      });

      if (copiedCount > 0) {
        showToast('Billing address copied to shipping address!', 'info');
      } else {
        showToast('Please fill out the billing address first.', 'warning');
      }
    });
  }

  // --- All-India PIN Code Prefix to State Mapping (100% Indian Postal Zones) ---
  const pinPrefixMap = {
    '11': 'Delhi',
    '12': 'Haryana', '13': 'Haryana',
    '14': 'Punjab', '15': 'Punjab',
    '16': 'Chandigarh',
    '17': 'Himachal Pradesh',
    '18': 'Jammu and Kashmir', '19': 'Jammu and Kashmir',
    '20': 'Uttar Pradesh', '21': 'Uttar Pradesh', '22': 'Uttar Pradesh', '23': 'Uttar Pradesh',
    '24': 'Uttar Pradesh', '25': 'Uttar Pradesh', '26': 'Uttar Pradesh', '27': 'Uttar Pradesh', '28': 'Uttar Pradesh',
    '30': 'Rajasthan', '31': 'Rajasthan', '32': 'Rajasthan', '33': 'Rajasthan', '34': 'Rajasthan',
    '36': 'Gujarat', '37': 'Gujarat', '38': 'Gujarat', '39': 'Gujarat',
    '40': 'Maharashtra', '41': 'Maharashtra', '42': 'Maharashtra', '43': 'Maharashtra', '44': 'Maharashtra',
    '45': 'Madhya Pradesh', '46': 'Madhya Pradesh', '47': 'Madhya Pradesh', '48': 'Madhya Pradesh',
    '49': 'Chhattisgarh',
    '50': 'Telangana', '51': 'Andhra Pradesh', '52': 'Andhra Pradesh', '53': 'Andhra Pradesh',
    '56': 'Karnataka', '57': 'Karnataka', '58': 'Karnataka', '59': 'Karnataka',
    '60': 'Tamil Nadu', '61': 'Tamil Nadu', '62': 'Tamil Nadu', '63': 'Tamil Nadu', '64': 'Tamil Nadu',
    '67': 'Kerala', '68': 'Kerala', '69': 'Kerala',
    '70': 'West Bengal', '71': 'West Bengal', '72': 'West Bengal', '73': 'West Bengal', '74': 'West Bengal',
    '75': 'Odisha', '76': 'Odisha', '77': 'Odisha',
    '78': 'Assam',
    '79': 'North East (Assam/Meghalaya/Tripura/Manipur/Nagaland/Mizoram/Arunachal)',
    '80': 'Bihar', '81': 'Bihar', '82': 'Jharkhand', '83': 'Jharkhand', '84': 'Bihar', '85': 'Bihar'
  };

  // Specific 3-digit overrides
  const pin3PrefixMap = {
    '244': 'Uttar Pradesh', '246': 'Uttarakhand', '247': 'Uttar Pradesh', '248': 'Uttarakhand', '249': 'Uttarakhand', '263': 'Uttarakhand',
    '403': 'Goa',
    '396': 'Dadra and Nagar Haveli and Daman and Diu',
    '605': 'Puducherry',
    '682': 'Lakshadweep',
    '744': 'Andaman and Nicobar Islands',
    '790': 'Arunachal Pradesh', '791': 'Arunachal Pradesh', '792': 'Arunachal Pradesh',
    '793': 'Meghalaya', '794': 'Meghalaya',
    '795': 'Manipur',
    '796': 'Mizoram',
    '797': 'Nagaland', '798': 'Nagaland',
    '799': 'Tripura',
    '737': 'Sikkim',
    '194': 'Ladakh'
  };

  // --- Comprehensive All-India District & City to State Dictionary ---
  const districtStateMap = {
    // West Bengal (All Districts & Key Cities)
    'kolkata': 'West Bengal', 'calcutta': 'West Bengal', 'howrah': 'West Bengal', 'hooghly': 'West Bengal',
    'north 24 parganas': 'West Bengal', 'south 24 parganas': 'West Bengal', 'nadia': 'West Bengal',
    'murshidabad': 'West Bengal', 'birbhum': 'West Bengal', 'bankura': 'West Bengal', 'purulia': 'West Bengal',
    'purba medinipur': 'West Bengal', 'paschim medinipur': 'West Bengal', 'medinipur': 'West Bengal',
    'midnapore': 'West Bengal', 'purba bardhaman': 'West Bengal', 'paschim bardhaman': 'West Bengal',
    'burdwan': 'West Bengal', 'bardhaman': 'West Bengal', 'malda': 'West Bengal', 'maldah': 'West Bengal',
    'uttar dinajpur': 'West Bengal', 'dakshin dinajpur': 'West Bengal', 'jalpaiguri': 'West Bengal',
    'alipurduar': 'West Bengal', 'cooch behar': 'West Bengal', 'darjeeling': 'West Bengal', 'kalimpong': 'West Bengal',
    'jhargram': 'West Bengal', 'siliguri': 'West Bengal', 'durgapur': 'West Bengal', 'asansol': 'West Bengal',
    'kharagpur': 'West Bengal', 'haldia': 'West Bengal', 'berhampore': 'West Bengal', 'baharampur': 'West Bengal',
    'barasat': 'West Bengal', 'barrackpore': 'West Bengal', 'krishnanagar': 'West Bengal', 'santipur': 'West Bengal',
    'shantipur': 'West Bengal', 'ranaghat': 'West Bengal', 'bolpur': 'West Bengal', 'suri': 'West Bengal',
    'shantiniketan': 'West Bengal', 'chinsurah': 'West Bengal', 'chandannagar': 'West Bengal', 'serampore': 'West Bengal',

    // Maharashtra
    'mumbai': 'Maharashtra', 'mumbai city': 'Maharashtra', 'mumbai suburban': 'Maharashtra', 'bombay': 'Maharashtra',
    'thane': 'Maharashtra', 'pune': 'Maharashtra', 'nagpur': 'Maharashtra', 'nashik': 'Maharashtra',
    'aurangabad': 'Maharashtra', 'chhatrapati sambhaji nagar': 'Maharashtra', 'sambhajinagar': 'Maharashtra',
    'solapur': 'Maharashtra', 'amravati': 'Maharashtra', 'navi mumbai': 'Maharashtra', 'kolhapur': 'Maharashtra',
    'sangli': 'Maharashtra', 'satara': 'Maharashtra', 'ahmednagar': 'Maharashtra', 'ahilyanagar': 'Maharashtra',
    'akola': 'Maharashtra', 'latur': 'Maharashtra', 'dhule': 'Maharashtra', 'jalgaon': 'Maharashtra',
    'nanded': 'Maharashtra', 'raigad': 'Maharashtra', 'ratnagiri': 'Maharashtra', 'sindhudurg': 'Maharashtra',
    'wardha': 'Maharashtra', 'chandrapur': 'Maharashtra', 'gondia': 'Maharashtra', 'bhandara': 'Maharashtra',
    'yavatmal': 'Maharashtra', 'beed': 'Maharashtra', 'bid': 'Maharashtra', 'buldhana': 'Maharashtra',
    'gadchiroli': 'Maharashtra', 'hingoli': 'Maharashtra', 'jalna': 'Maharashtra', 'nandurbar': 'Maharashtra',
    'osmanabad': 'Maharashtra', 'dharashiv': 'Maharashtra', 'palghar': 'Maharashtra', 'parbhani': 'Maharashtra',
    'washim': 'Maharashtra', 'kalyan': 'Maharashtra', 'dombivli': 'Maharashtra', 'vasai': 'Maharashtra', 'virar': 'Maharashtra',

    // Delhi & NCR
    'delhi': 'Delhi', 'new delhi': 'Delhi', 'north delhi': 'Delhi', 'south delhi': 'Delhi', 'east delhi': 'Delhi',
    'west delhi': 'Delhi', 'central delhi': 'Delhi', 'north east delhi': 'Delhi', 'north west delhi': 'Delhi',
    'south east delhi': 'Delhi', 'south west delhi': 'Delhi', 'shahdara': 'Delhi', 'dwarka': 'Delhi',
    'rohini': 'Delhi', 'saket': 'Delhi', 'connaught place': 'Delhi', 'karol bagh': 'Delhi', 'lajpat nagar': 'Delhi',

    // Uttar Pradesh (All 75 districts & cities)
    'lucknow': 'Uttar Pradesh', 'kanpur': 'Uttar Pradesh', 'kanpur nagar': 'Uttar Pradesh', 'kanpur dehat': 'Uttar Pradesh',
    'varanasi': 'Uttar Pradesh', 'banaras': 'Uttar Pradesh', 'kashi': 'Uttar Pradesh', 'agra': 'Uttar Pradesh',
    'prayagraj': 'Uttar Pradesh', 'allahabad': 'Uttar Pradesh', 'ghaziabad': 'Uttar Pradesh', 'noida': 'Uttar Pradesh',
    'gautam buddha nagar': 'Uttar Pradesh', 'greater noida': 'Uttar Pradesh', 'meerut': 'Uttar Pradesh',
    'bareilly': 'Uttar Pradesh', 'aligarh': 'Uttar Pradesh', 'moradabad': 'Uttar Pradesh', 'saharanpur': 'Uttar Pradesh',
    'gorakhpur': 'Uttar Pradesh', 'faizabad': 'Uttar Pradesh', 'ayodhya': 'Uttar Pradesh', 'jhansi': 'Uttar Pradesh',
    'muzaffarnagar': 'Uttar Pradesh', 'mathura': 'Uttar Pradesh', 'firozabad': 'Uttar Pradesh', 'ambedkar nagar': 'Uttar Pradesh',
    'amethi': 'Uttar Pradesh', 'amroha': 'Uttar Pradesh', 'auraiya': 'Uttar Pradesh', 'azamgarh': 'Uttar Pradesh',
    'baghpat': 'Uttar Pradesh', 'bahraich': 'Uttar Pradesh', 'ballia': 'Uttar Pradesh', 'balrampur': 'Uttar Pradesh',
    'banda': 'Uttar Pradesh', 'barabanki': 'Uttar Pradesh', 'basti': 'Uttar Pradesh', 'bhadohi': 'Uttar Pradesh',
    'bijnor': 'Uttar Pradesh', 'budaun': 'Uttar Pradesh', 'bulandshahr': 'Uttar Pradesh', 'chandauli': 'Uttar Pradesh',
    'chitrakoot': 'Uttar Pradesh', 'deoria': 'Uttar Pradesh', 'etah': 'Uttar Pradesh', 'etawah': 'Uttar Pradesh',
    'farrukhabad': 'Uttar Pradesh', 'fatehpur': 'Uttar Pradesh', 'gonda': 'Uttar Pradesh', 'hamirpur': 'Uttar Pradesh',
    'hapur': 'Uttar Pradesh', 'hardoi': 'Uttar Pradesh', 'hathras': 'Uttar Pradesh', 'jalaun': 'Uttar Pradesh',
    'jaunpur': 'Uttar Pradesh', 'kannauj': 'Uttar Pradesh', 'kasganj': 'Uttar Pradesh', 'kaushambi': 'Uttar Pradesh',
    'kushinagar': 'Uttar Pradesh', 'lakhimpur kheri': 'Uttar Pradesh', 'lalitpur': 'Uttar Pradesh', 'maharajganj': 'Uttar Pradesh',
    'mahoba': 'Uttar Pradesh', 'mainpuri': 'Uttar Pradesh', 'mau': 'Uttar Pradesh', 'mirzapur': 'Uttar Pradesh',
    'pilibhit': 'Uttar Pradesh', 'pratapgarh': 'Uttar Pradesh', 'rae bareli': 'Uttar Pradesh', 'rampur': 'Uttar Pradesh',
    'sambhal': 'Uttar Pradesh', 'sant kabir nagar': 'Uttar Pradesh', 'shahjahanpur': 'Uttar Pradesh', 'shamli': 'Uttar Pradesh',
    'shrawasti': 'Uttar Pradesh', 'siddharthnagar': 'Uttar Pradesh', 'sitapur': 'Uttar Pradesh', 'sonbhadra': 'Uttar Pradesh',
    'sultanpur': 'Uttar Pradesh', 'unnao': 'Uttar Pradesh', 'vrindavan': 'Uttar Pradesh',

    // Karnataka (All 31 districts & cities)
    'bengaluru': 'Karnataka', 'bangalore': 'Karnataka', 'bengaluru urban': 'Karnataka', 'bengaluru rural': 'Karnataka',
    'mysuru': 'Karnataka', 'mysore': 'Karnataka', 'mangaluru': 'Karnataka', 'mangalore': 'Karnataka', 'hubballi': 'Karnataka',
    'hubli': 'Karnataka', 'dharwad': 'Karnataka', 'belagavi': 'Karnataka', 'belgaum': 'Karnataka', 'kalaburagi': 'Karnataka',
    'gulbarga': 'Karnataka', 'ballari': 'Karnataka', 'bellary': 'Karnataka', 'davangere': 'Karnataka', 'shivamogga': 'Karnataka',
    'shimoga': 'Karnataka', 'tumakuru': 'Karnataka', 'tumkur': 'Karnataka', 'udupi': 'Karnataka', 'dakshina kannada': 'Karnataka',
    'uttara kannada': 'Karnataka', 'hassan': 'Karnataka', 'mandya': 'Karnataka', 'kolar': 'Karnataka', 'chikkamagaluru': 'Karnataka',
    'bagalkot': 'Karnataka', 'bidar': 'Karnataka', 'chamarajanagar': 'Karnataka', 'chikkaballapur': 'Karnataka',
    'chitradurga': 'Karnataka', 'gadag': 'Karnataka', 'haveri': 'Karnataka', 'kodagu': 'Karnataka', 'coorg': 'Karnataka',
    'koppal': 'Karnataka', 'raichur': 'Karnataka', 'ramanagara': 'Karnataka', 'vijayanagara': 'Karnataka', 'yadgir': 'Karnataka',

    // Tamil Nadu (All 38 districts & cities)
    'chennai': 'Tamil Nadu', 'madras': 'Tamil Nadu', 'coimbatore': 'Tamil Nadu', 'madurai': 'Tamil Nadu',
    'tiruchirappalli': 'Tamil Nadu', 'trichy': 'Tamil Nadu', 'salem': 'Tamil Nadu', 'tirunelveli': 'Tamil Nadu',
    'tiruppur': 'Tamil Nadu', 'erode': 'Tamil Nadu', 'vellore': 'Tamil Nadu', 'thoothukudi': 'Tamil Nadu',
    'tuticorin': 'Tamil Nadu', 'thanjavur': 'Tamil Nadu', 'dindigul': 'Tamil Nadu', 'kancheepuram': 'Tamil Nadu',
    'kanchipuram': 'Tamil Nadu', 'chengalpattu': 'Tamil Nadu', 'cuddalore': 'Tamil Nadu', 'kanyakumari': 'Tamil Nadu',
    'krishnagiri': 'Tamil Nadu', 'namakkal': 'Tamil Nadu', 'thiruvallur': 'Tamil Nadu', 'ariyalur': 'Tamil Nadu',
    'dharmapuri': 'Tamil Nadu', 'kallakurichi': 'Tamil Nadu', 'karur': 'Tamil Nadu', 'mayiladuthurai': 'Tamil Nadu',
    'nagapattinam': 'Tamil Nadu', 'nilgiris': 'Tamil Nadu', 'ooty': 'Tamil Nadu', 'perambalur': 'Tamil Nadu',
    'pudukkottai': 'Tamil Nadu', 'ramanathapuram': 'Tamil Nadu', 'ranipet': 'Tamil Nadu', 'sivaganga': 'Tamil Nadu',
    'tenkasi': 'Tamil Nadu', 'theni': 'Tamil Nadu', 'thiruvarur': 'Tamil Nadu', 'tirupathur': 'Tamil Nadu',
    'tiruvannamalai': 'Tamil Nadu', 'villupuram': 'Tamil Nadu', 'virudhunagar': 'Tamil Nadu',

    // Gujarat (All 33 districts & cities)
    'ahmedabad': 'Gujarat', 'surat': 'Gujarat', 'vadodara': 'Gujarat', 'baroda': 'Gujarat', 'rajkot': 'Gujarat',
    'bhavnagar': 'Gujarat', 'jamnagar': 'Gujarat', 'junagadh': 'Gujarat', 'gandhinagar': 'Gujarat', 'anand': 'Gujarat',
    'navsari': 'Gujarat', 'morbi': 'Gujarat', 'bharuch': 'Gujarat', 'valsad': 'Gujarat', 'kutch': 'Gujarat',
    'bhuj': 'Gujarat', 'mehsana': 'Gujarat', 'porbandar': 'Gujarat', 'amreli': 'Gujarat', 'aravalli': 'Gujarat',
    'banaskantha': 'Gujarat', 'botad': 'Gujarat', 'chhota udaipur': 'Gujarat', 'dahod': 'Gujarat', 'dang': 'Gujarat',
    'devbhoomi dwarka': 'Gujarat', 'dwarka': 'Gujarat', 'gir somnath': 'Gujarat', 'somnath': 'Gujarat', 'kheda': 'Gujarat',
    'mahisagar': 'Gujarat', 'narmada': 'Gujarat', 'panchmahal': 'Gujarat', 'patan': 'Gujarat', 'sabarkantha': 'Gujarat',
    'tapi': 'Gujarat', 'surendranagar': 'Gujarat', 'vapi': 'Gujarat', 'ankleshwar': 'Gujarat',

    // Rajasthan (Districts & Cities)
    'jaipur': 'Rajasthan', 'jodhpur': 'Rajasthan', 'udaipur': 'Rajasthan', 'kota': 'Rajasthan', 'bikaner': 'Rajasthan',
    'ajmer': 'Rajasthan', 'bhilwara': 'Rajasthan', 'alwar': 'Rajasthan', 'sikar': 'Rajasthan', 'pali': 'Rajasthan',
    'sri ganganagar': 'Rajasthan', 'bharatpur': 'Rajasthan', 'chittorgarh': 'Rajasthan', 'jhunjhunu': 'Rajasthan',
    'barmer': 'Rajasthan', 'banswara': 'Rajasthan', 'baran': 'Rajasthan', 'beawar': 'Rajasthan', 'boondi': 'Rajasthan',
    'bundi': 'Rajasthan', 'churu': 'Rajasthan', 'dausa': 'Rajasthan', 'dholpur': 'Rajasthan', 'dungarpur': 'Rajasthan',
    'hanumangarh': 'Rajasthan', 'jaisalmer': 'Rajasthan', 'jalore': 'Rajasthan', 'jhalawar': 'Rajasthan',
    'karauli': 'Rajasthan', 'nagaur': 'Rajasthan', 'pratapgarh': 'Rajasthan', 'rajsamand': 'Rajasthan',
    'sawai madhopur': 'Rajasthan', 'sirohi': 'Rajasthan', 'tonk': 'Rajasthan', 'mount abu': 'Rajasthan',

    // Telangana & Andhra Pradesh
    'hyderabad': 'Telangana', 'secunderabad': 'Telangana', 'warangal': 'Telangana', 'nizamabad': 'Telangana',
    'karimnagar': 'Telangana', 'khammam': 'Telangana', 'ramagundam': 'Telangana', 'mahbubnagar': 'Telangana',
    'nalgonda': 'Telangana', 'adilabad': 'Telangana', 'bhadradri kothagudem': 'Telangana', 'jagtial': 'Telangana',
    'jangaon': 'Telangana', 'jayashankar bhupalpally': 'Telangana', 'jogulamba gadwal': 'Telangana', 'kamareddy': 'Telangana',
    'komaram bheem': 'Telangana', 'mahabubabad': 'Telangana', 'mancherial': 'Telangana', 'medak': 'Telangana',
    'medchal malkajgiri': 'Telangana', 'mulugu': 'Telangana', 'nagarkurnool': 'Telangana', 'narayanpet': 'Telangana',
    'nirmal': 'Telangana', 'peddapalli': 'Telangana', 'rajanna sircilla': 'Telangana', 'ranga reddy': 'Telangana',
    'sangareddy': 'Telangana', 'siddipet': 'Telangana', 'suryapet': 'Telangana', 'vikarabad': 'Telangana',
    'wanaparthy': 'Telangana', 'yadadri bhuvanagiri': 'Telangana',
    'visakhapatnam': 'Andhra Pradesh', 'vizag': 'Andhra Pradesh', 'vijayawada': 'Andhra Pradesh', 'guntur': 'Andhra Pradesh',
    'nellore': 'Andhra Pradesh', 'kurnool': 'Andhra Pradesh', 'rajamahendravaram': 'Andhra Pradesh', 'rajahmundry': 'Andhra Pradesh',
    'tirupati': 'Andhra Pradesh', 'kakinada': 'Andhra Pradesh', 'kadapa': 'Andhra Pradesh', 'anantapur': 'Andhra Pradesh',
    'alluri sitharama raju': 'Andhra Pradesh', 'anakapalli': 'Andhra Pradesh', 'annamayya': 'Andhra Pradesh',
    'bapatla': 'Andhra Pradesh', 'chittoor': 'Andhra Pradesh', 'east godavari': 'Andhra Pradesh', 'eluru': 'Andhra Pradesh',
    'konaseema': 'Andhra Pradesh', 'krishna': 'Andhra Pradesh', 'nandyal': 'Andhra Pradesh', 'ntr': 'Andhra Pradesh',
    'palnadu': 'Andhra Pradesh', 'parvathipuram manyam': 'Andhra Pradesh', 'prakasam': 'Andhra Pradesh',
    'sri sathya sai': 'Andhra Pradesh', 'srikakulam': 'Andhra Pradesh', 'vizianagaram': 'Andhra Pradesh', 'west godavari': 'Andhra Pradesh',

    // Bihar & Jharkhand
    'patna': 'Bihar', 'gaya': 'Bihar', 'bhagalpur': 'Bihar', 'muzaffarpur': 'Bihar', 'purnia': 'Bihar',
    'darbhanga': 'Bihar', 'bihar sharif': 'Bihar', 'arrah': 'Bihar', 'begusarai': 'Bihar', 'katihar': 'Bihar',
    'munger': 'Bihar', 'chhapra': 'Bihar', 'sasaram': 'Bihar', 'hajipur': 'Bihar', 'dehri': 'Bihar',
    'bettiah': 'Bihar', 'motihari': 'Bihar', 'siwan': 'Bihar', 'buxar': 'Bihar', 'kishanganj': 'Bihar',
    'sitamarhi': 'Bihar', 'madhubani': 'Bihar', 'samastipur': 'Bihar', 'saharsa': 'Bihar', 'supaul': 'Bihar',
    'araria': 'Bihar', 'aurangabad bihar': 'Bihar', 'banka': 'Bihar', 'gopalganj': 'Bihar', 'jamui': 'Bihar',
    'jehanabad': 'Bihar', 'kaimur': 'Bihar', 'khagaria': 'Bihar', 'lakhisarai': 'Bihar', 'madhepura': 'Bihar',
    'nawada': 'Bihar', 'rohtas': 'Bihar', 'sheohar': 'Bihar', 'sheikhpura': 'Bihar', 'vaishali': 'Bihar',
    'ranchi': 'Jharkhand', 'jamshedpur': 'Jharkhand', 'tatanagar': 'Jharkhand', 'dhanbad': 'Jharkhand',
    'bokaro': 'Jharkhand', 'deoghar': 'Jharkhand', 'hazaribagh': 'Jharkhand', 'giridih': 'Jharkhand',
    'ramgarh': 'Jharkhand', 'chaibasa': 'Jharkhand', 'dumka': 'Jharkhand', 'godda': 'Jharkhand', 'gumla': 'Jharkhand',
    'jamtara': 'Jharkhand', 'khunti': 'Jharkhand', 'koderma': 'Jharkhand', 'latehar': 'Jharkhand', 'lohardaga': 'Jharkhand',
    'pakur': 'Jharkhand', 'palamu': 'Jharkhand', 'sahibganj': 'Jharkhand', 'saraikela': 'Jharkhand', 'simdega': 'Jharkhand',

    // Madhya Pradesh & Chhattisgarh
    'bhopal': 'Madhya Pradesh', 'indore': 'Madhya Pradesh', 'jabalpur': 'Madhya Pradesh', 'gwalior': 'Madhya Pradesh',
    'ujjain': 'Madhya Pradesh', 'sagar': 'Madhya Pradesh', 'dewas': 'Madhya Pradesh', 'satna': 'Madhya Pradesh',
    'ratlam': 'Madhya Pradesh', 'rewa': 'Madhya Pradesh', 'katni': 'Madhya Pradesh', 'singrauli': 'Madhya Pradesh',
    'burhanpur': 'Madhya Pradesh', 'khandwa': 'Madhya Pradesh', 'khargone': 'Madhya Pradesh', 'bhind': 'Madhya Pradesh',
    'shivpuri': 'Madhya Pradesh', 'vidisha': 'Madhya Pradesh', 'chhindwara': 'Madhya Pradesh', 'guna': 'Madhya Pradesh',
    'damoh': 'Madhya Pradesh', 'mandsaur': 'Madhya Pradesh', 'sehore': 'Madhya Pradesh', 'hoshangabad': 'Madhya Pradesh',
    'narmadapuram': 'Madhya Pradesh', 'raipur': 'Chhattisgarh', 'bhilai': 'Chhattisgarh', 'bilaspur': 'Chhattisgarh',
    'korba': 'Chhattisgarh', 'durg': 'Chhattisgarh', 'rajnandgaon': 'Chhattisgarh', 'jagdalpur': 'Chhattisgarh',
    'ambikapur': 'Chhattisgarh', 'dhamtari': 'Chhattisgarh', 'mahasamund': 'Chhattisgarh', 'raigarh': 'Chhattisgarh',

    // Kerala & Goa
    'thiruvananthapuram': 'Kerala', 'trivandrum': 'Kerala', 'kochi': 'Kerala', 'cochin': 'Kerala', 'ernakulam': 'Kerala',
    'kozhikode': 'Kerala', 'calicut': 'Kerala', 'kollam': 'Kerala', 'thrissur': 'Kerala', 'kannur': 'Kerala',
    'alappuzha': 'Kerala', 'alleppey': 'Kerala', 'kottayam': 'Kerala', 'palakkad': 'Kerala', 'malappuram': 'Kerala',
    'kasaragod': 'Kerala', 'idukki': 'Kerala', 'pathanamthitta': 'Kerala', 'wayanad': 'Kerala',
    'panaji': 'Goa', 'panjim': 'Goa', 'margao': 'Goa', 'vasco da gama': 'Goa', 'vasco': 'Goa',
    'mapusa': 'Goa', 'ponda': 'Goa', 'north goa': 'Goa', 'south goa': 'Goa',

    // Odisha, Punjab & Haryana
    'bhubaneswar': 'Odisha', 'cuttack': 'Odisha', 'rourkela': 'Odisha', 'berhampur': 'Odisha', 'sambalpur': 'Odisha',
    'puri': 'Odisha', 'balasore': 'Odisha', 'bhadrak': 'Odisha', 'baripada': 'Odisha', 'jharsuguda': 'Odisha',
    'angul': 'Odisha', 'balangir': 'Odisha', 'bargadh': 'Odisha', 'dhenkanal': 'Odisha', 'ganjam': 'Odisha',
    'jajpur': 'Odisha', 'kalahandi': 'Odisha', 'kendujhar': 'Odisha', 'keonjhar': 'Odisha', 'koraput': 'Odisha',
    'mayurbhanj': 'Odisha', 'nabarangpur': 'Odisha', 'rayagada': 'Odisha', 'sundargarh': 'Odisha',
    'ludhiana': 'Punjab', 'amritsar': 'Punjab', 'jalandhar': 'Punjab', 'patiala': 'Punjab', 'bathinda': 'Punjab',
    'mohali': 'Punjab', 'sas nagar': 'Punjab', 'hoshiarpur': 'Punjab', 'batala': 'Punjab', 'pathankot': 'Punjab',
    'moga': 'Punjab', 'abohar': 'Punjab', 'malerkotla': 'Punjab', 'khanna': 'Punjab', 'phagwara': 'Punjab',
    'ferozepur': 'Punjab', 'kapurthala': 'Punjab', 'fazilka': 'Punjab', 'gurdaspur': 'Punjab', 'barnala': 'Punjab',
    'faridkot': 'Punjab', 'fatehgarh sahib': 'Punjab', 'mansa': 'Punjab', 'muktsar': 'Punjab', 'rupnagar': 'Punjab',
    'sangrur': 'Punjab', 'tarn taran': 'Punjab',
    'gurugram': 'Haryana', 'gurgaon': 'Haryana', 'faridabad': 'Haryana', 'panipat': 'Haryana', 'ambala': 'Haryana',
    'yamunanagar': 'Haryana', 'rohtak': 'Haryana', 'hisar': 'Haryana', 'karnal': 'Haryana', 'sonipat': 'Haryana',
    'panchkula': 'Haryana', 'bhiwani': 'Haryana', 'sirsa': 'Haryana', 'bahadurgarh': 'Haryana', 'rewari': 'Haryana',
    'charkhi dadri': 'Haryana', 'fatehabad': 'Haryana', 'jind': 'Haryana', 'jhajjar': 'Haryana', 'kaithal': 'Haryana',
    'kurukshetra': 'Haryana', 'mahendragarh': 'Haryana', 'nuh': 'Haryana', 'palwal': 'Haryana',

    // Uttarakhand & Himachal Pradesh
    'dehradun': 'Uttarakhand', 'haridwar': 'Uttarakhand', 'roorkee': 'Uttarakhand', 'haldwani': 'Uttarakhand',
    'rudrapur': 'Uttarakhand', 'rishikesh': 'Uttarakhand', 'kashipur': 'Uttarakhand', 'nainital': 'Uttarakhand',
    'almora': 'Uttarakhand', 'pithoragarh': 'Uttarakhand', 'chamoli': 'Uttarakhand', 'pauri garhwal': 'Uttarakhand',
    'tehri garhwal': 'Uttarakhand', 'uttarkashi': 'Uttarakhand', 'bageshwar': 'Uttarakhand', 'champawat': 'Uttarakhand',
    'shimla': 'Himachal Pradesh', 'dharamshala': 'Himachal Pradesh', 'mandi': 'Himachal Pradesh', 'solan': 'Himachal Pradesh',
    'kullu': 'Himachal Pradesh', 'manali': 'Himachal Pradesh', 'bilaspur hp': 'Himachal Pradesh', 'chamba': 'Himachal Pradesh',
    'hamirpur hp': 'Himachal Pradesh', 'kangra': 'Himachal Pradesh', 'kinnaur': 'Himachal Pradesh', 'lahaul and spiti': 'Himachal Pradesh',
    'sirmaur': 'Himachal Pradesh', 'una': 'Himachal Pradesh',

    // Assam & North Eastern States
    'guwahati': 'Assam', 'silchar': 'Assam', 'dibrugarh': 'Assam', 'jorhat': 'Assam', 'nagaon': 'Assam',
    'tezpur': 'Assam', 'tinsukia': 'Assam', 'bongaigaon': 'Assam', 'barpeta': 'Assam', 'dhubri': 'Assam',
    'goalpara': 'Assam', 'golaghat': 'Assam', 'karimganj': 'Assam', 'sivasagar': 'Assam', 'sonitpur': 'Assam',
    'shillong': 'Meghalaya', 'tura': 'Meghalaya', 'cherrapunji': 'Meghalaya', 'imphal': 'Manipur', 'churachandpur': 'Manipur',
    'agartala': 'Tripura', 'udaipur tripura': 'Tripura', 'aizawl': 'Mizoram', 'lunglei': 'Mizoram',
    'kohima': 'Nagaland', 'dimapur': 'Nagaland', 'itanagar': 'Arunachal Pradesh', 'tawang': 'Arunachal Pradesh',
    'gangtok': 'Sikkim', 'namchi': 'Sikkim', 'pelling': 'Sikkim',

    // Jammu & Kashmir, Ladakh & Union Territories
    'srinagar': 'Jammu and Kashmir', 'jammu': 'Jammu and Kashmir', 'anantnag': 'Jammu and Kashmir', 'baramulla': 'Jammu and Kashmir',
    'udhampur': 'Jammu and Kashmir', 'kathua': 'Jammu and Kashmir', 'kupwara': 'Jammu and Kashmir', 'pulwama': 'Jammu and Kashmir',
    'leh': 'Ladakh', 'kargil': 'Ladakh',
    'chandigarh': 'Chandigarh',
    'puducherry': 'Puducherry', 'pondicherry': 'Puducherry', 'karaikal': 'Puducherry', 'mahe': 'Puducherry', 'yanam': 'Puducherry',
    'port blair': 'Andaman and Nicobar Islands', 'daman': 'Dadra and Nagar Haveli and Daman and Diu',
    'diu': 'Dadra and Nagar Haveli and Daman and Diu', 'silvassa': 'Dadra and Nagar Haveli and Daman and Diu',
    'kavaratti': 'Lakshadweep'
  };

  // Auto-Fill State from either District or City input
  function setupStateAutoDetector(fieldId, stateInputId, districtInputId) {
    const el = document.getElementById(fieldId);
    const stateEl = document.getElementById(stateInputId);
    const distEl = districtInputId ? document.getElementById(districtInputId) : null;
    if (!el || !stateEl) return;

    const detectState = () => {
      const val = el.value.trim().toLowerCase();
      if (!val || val.length < 3) return;

      // 1. Exact match
      if (districtStateMap[val]) {
        stateEl.value = districtStateMap[val];
        return;
      }

      // 2. Starts with / substring search
      const matchedKey = Object.keys(districtStateMap).find(
        (key) => key.startsWith(val) || val.startsWith(key) || (val.length >= 4 && key.includes(val))
      );

      if (matchedKey) {
        stateEl.value = districtStateMap[matchedKey];
        if (distEl && !distEl.value.trim() && fieldId.includes('City')) {
          // Format Title Case
          distEl.value = matchedKey.replace(/\b\w/g, (c) => c.toUpperCase());
        }
      }
    };

    el.addEventListener('input', detectState);
    el.addEventListener('change', detectState);
    el.addEventListener('blur', detectState);
  }

  // --- Auto-fill from Pincode with Live Postal API & Instant Prefix Fallback ---
  function setupPincodeAutoFill(pincodeId, cityId, districtId, stateId) {
    const pinEl = document.getElementById(pincodeId);
    const cityEl = document.getElementById(cityId);
    const distEl = document.getElementById(districtId);
    const stateEl = document.getElementById(stateId);
    if (!pinEl) return;

    const handlePinInput = async () => {
      const pin = pinEl.value.trim();

      // Instant Fallback from PIN prefix while typing
      if (pin.length >= 2) {
        const prefix3 = pin.substring(0, 3);
        const prefix2 = pin.substring(0, 2);
        const estimatedState = pin3PrefixMap[prefix3] || pinPrefixMap[prefix2];
        if (estimatedState && (!stateEl.value || stateEl.value.trim() === '')) {
          stateEl.value = estimatedState;
        }
      }

      // Exact 6-digit Pincode Live Verification
      if (pin.length === 6 && /^\d{6}$/.test(pin)) {
        // Immediate prefix update
        const prefix3 = pin.substring(0, 3);
        const prefix2 = pin.substring(0, 2);
        const fallbackState = pin3PrefixMap[prefix3] || pinPrefixMap[prefix2];
        if (fallbackState) {
          stateEl.value = fallbackState;
        }

        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
          const data = await res.json();
          if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const po = data[0].PostOffice[0];

            if (po.District) distEl.value = po.District;
            if (po.State) stateEl.value = po.State;

            const cityName = (po.Block && po.Block !== 'NA') ? po.Block :
              (po.Division && po.Division !== 'NA' ? po.Division :
                (po.Taluk && po.Taluk !== 'NA' ? po.Taluk : po.Name));

            if (cityName && cityName !== 'NA') {
              cityEl.value = cityName;
            }
          }
        } catch (e) {
          console.warn('Pincode API lookup offline, used postal circle mapping');
        }
      }
    };

    pinEl.addEventListener('input', handlePinInput);
    pinEl.addEventListener('change', handlePinInput);
    pinEl.addEventListener('blur', handlePinInput);
  }

  // Initialize Auto-Fill for both Billing & Shipping across ALL fields
  setupStateAutoDetector('billingCity', 'billingState', 'billingDistrict');
  setupStateAutoDetector('billingDistrict', 'billingState', null);
  setupStateAutoDetector('shippingCity', 'shippingState', 'shippingDistrict');
  setupStateAutoDetector('shippingDistrict', 'shippingState', null);

  setupPincodeAutoFill('billingPincode', 'billingCity', 'billingDistrict', 'billingState');
  setupPincodeAutoFill('shippingPincode', 'shippingCity', 'shippingDistrict', 'shippingState');

  // Clickable step indicator jumping (with strict step validation)
  document.querySelectorAll('.step-item').forEach((item) => {
    item.addEventListener('click', () => {
      const targetStep = parseInt(item.getAttribute('data-step'), 10);
      if (targetStep < currentStep) {
        // Going back to previous step is always allowed
        currentStep = targetStep;
        updateWizardView();
      } else if (targetStep > currentStep) {
        // Must pass validation for all steps up to targetStep
        for (let s = currentStep; s < targetStep; s++) {
          if (!validateStep(s)) {
            currentStep = s;
            updateWizardView();
            return;
          }
        }
        currentStep = targetStep;
        updateWizardView();
      }
    });
  });

  // --- CAPTCHA Generator Logic ---
  let signInCaptchaCode = '';
  let signUpCaptchaCode = '';

  function generateCaptchaText(length = 5) {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  function drawCaptcha(type) {
    const canvas = document.getElementById(type === 'signIn' ? 'signInCaptchaCanvas' : 'signUpCaptchaCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const captchaText = generateCaptchaText(5);
    if (type === 'signIn') {
      signInCaptchaCode = captchaText;
    } else {
      signUpCaptchaCode = captchaText;
    }

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f1f5f9');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Noise lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = ['#4169E1', '#0284c7', '#94a3b8', '#64748b'][i % 4];
      ctx.lineWidth = Math.random() * 1.5 + 0.8;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height
      );
      ctx.stroke();
    }

    // Characters
    ctx.textBaseline = 'middle';
    const charSpacing = width / (captchaText.length + 1);

    for (let i = 0; i < captchaText.length; i++) {
      const char = captchaText[i];
      ctx.save();
      const x = charSpacing * (i + 1);
      const y = height / 2 + (Math.random() * 3 - 1.5);
      ctx.translate(x, y);
      ctx.rotate((Math.random() * 0.3 - 0.15));

      ctx.font = `bold ${Math.floor(Math.random() * 3 + 18)}px "Plus Jakarta Sans", monospace`;
      ctx.fillStyle = ['#0f172a', '#4169E1', '#0f766e', '#1e293b'][Math.floor(Math.random() * 4)];
      ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
      ctx.shadowBlur = 2;
      ctx.fillText(char, -6, 0);
      ctx.restore();
    }
  }

  // Initialize Login CAPTCHA
  drawCaptcha('signIn');

  const refreshSignInCaptchaBtn = document.getElementById('refreshSignInCaptcha');
  if (refreshSignInCaptchaBtn) {
    refreshSignInCaptchaBtn.addEventListener('click', () => {
      drawCaptcha('signIn');
      document.getElementById('signInCaptchaInput').value = '';
    });
  }

  // Handle Login Submit
  signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const identifierEl = document.getElementById('signInIdentifier');
    const passwordEl = document.getElementById('signInPassword');
    const captchaEl = document.getElementById('signInCaptchaInput');

    const identifier = identifierEl ? identifierEl.value.trim() : '';
    const password = passwordEl ? passwordEl.value : '';
    const captchaInput = captchaEl ? captchaEl.value.trim().toUpperCase() : '';

    if (!identifier) {
      showToast('Please enter your email or 10-digit mobile number', 'error');
      if (identifierEl) identifierEl.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanPhone = identifier.replace(/[\s\-\+]/g, '');
    const isEmail = emailRegex.test(identifier);
    const isPhone = /^[6-9]\d{9}$/.test(cleanPhone) || (cleanPhone.length === 12 && cleanPhone.startsWith('91') && /^[6-9]\d{9}$/.test(cleanPhone.slice(2)));

    if (!isEmail && !isPhone) {
      if (/\d/.test(identifier) && !identifier.includes('@')) {
        showToast('Please enter a valid 10-digit mobile number', 'error');
      } else {
        showToast('Please enter a valid email address (e.g. name@company.com)', 'error');
      }
      if (identifierEl) identifierEl.focus();
      return;
    }

    if (!password) {
      showToast('Please enter your password', 'error');
      if (passwordEl) passwordEl.focus();
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      if (passwordEl) passwordEl.focus();
      return;
    }

    if (!captchaInput) {
      showToast('Please enter the CAPTCHA code', 'error');
      if (captchaEl) captchaEl.focus();
      return;
    }

    if (captchaInput !== signInCaptchaCode) {
      showToast('Incorrect CAPTCHA verification code. Please try again.', 'error');
      drawCaptcha('signIn');
      if (captchaEl) {
        captchaEl.value = '';
        captchaEl.focus();
      }
      return;
    }

    showToast(`Welcome to Nexon Power, ${identifier}! Redirecting to dashboard...`, 'success');
    setTimeout(() => {
      signInForm.reset();
      drawCaptcha('signIn');
    }, 2000);
  });

  // Handle Multi-step Sign Up Submit (Step 5)
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Verify all previous steps 1 to 4 are valid
    for (let s = 1; s <= 4; s++) {
      if (!validateStep(s)) {
        currentStep = s;
        updateWizardView();
        return;
      }
    }

    const poNum = document.getElementById('poNumber');
    const poCompany = document.getElementById('poCompanyName');
    if (!poNum || !poNum.value.trim()) {
      showToast('Please enter your Purchase Order Number', 'error');
      if (poNum) poNum.focus();
      return;
    }
    if (!poCompany || !poCompany.value.trim()) {
      showToast('Please enter your Company Name', 'error');
      if (poCompany) poCompany.focus();
      return;
    }

    showToast('Purchase Order submitted! Our team will verify and activate your account.', 'success');

    setTimeout(() => {
      signUpForm.reset();
      currentStep = 1;
      updateWizardView();
      switchToSignIn();
    }, 2000);
  });
});
