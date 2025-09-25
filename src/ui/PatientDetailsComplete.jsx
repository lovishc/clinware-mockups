import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function PatientDetailsComplete({ patient }) {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  
  // Default patient data - in a real app, you'd fetch this based on patientId
  const defaultPatient = { name: 'Patient 3', mrn: '4208211', age: 73, gender: 'F' }
  const currentPatient = patient || defaultPatient
  
  // Log the patient ID for debugging/development
  useEffect(() => {
    if (patientId) {
      console.log('Scorecard loaded for patient ID:', patientId)
    }
  }, [patientId])
  
  const handleBackToReferrals = () => {
    navigate('/referrals')
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      const customizeBtn = container.querySelector('#customize-btn')
      const customizeMenu = container.querySelector('#customize-menu')

      if (customizeBtn && customizeMenu) {
        const handleCustomizeClick = () => {
          customizeMenu.classList.toggle('hidden')
        }

        const handleClickOutside = (event) => {
          if (!customizeBtn.contains(event.target) && !customizeMenu.contains(event.target)) {
            customizeMenu.classList.add('hidden')
          }
        }

        customizeBtn.addEventListener('click', handleCustomizeClick)
        document.addEventListener('click', handleClickOutside)

        // Handle card toggles with local storage persistence
        const LOCAL_STORAGE_KEY = 'clinware-visible-cards';
        const cardToggles = container.querySelectorAll('#customize-menu input[type="checkbox"]');
        const toggleListeners = [];

        // Function to save current state to local storage
        const saveCardSettings = () => {
            const settings = {};
            cardToggles.forEach(t => {
                settings[t.dataset.card] = t.checked;
            });
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
        };

        // Load settings and apply them
        const savedSettings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

        cardToggles.forEach(toggle => {
            const cardKey = toggle.dataset.card;
            const card = container.querySelector('#card-' + cardKey);
            const tabButton = container.querySelector('#tab-' + cardKey);
            
            // Determine initial state
            let isVisible;
            if (savedSettings) {
                isVisible = savedSettings[cardKey] ?? true; // Default to visible if new card
            } else {
                isVisible = card ? !card.classList.contains('hidden') : true;
            }

            // Apply state to DOM
            toggle.checked = isVisible;
            if (card) card.classList.toggle('hidden', !isVisible);
            if (tabButton) tabButton.classList.toggle('hidden', !isVisible);

            // Add change listener
            const handleChange = () => {
                const isChecked = toggle.checked;
                if (card) card.classList.toggle('hidden', !isChecked);
                if (tabButton) tabButton.classList.toggle('hidden', !isChecked);
                saveCardSettings();
            };

            toggle.addEventListener('change', handleChange);
            toggleListeners.push({ toggle, handleChange });
        });

        // If no settings were saved previously, save the initial state now
        if (!savedSettings) {
            saveCardSettings();
        }

        return () => {
          customizeBtn.removeEventListener('click', handleCustomizeClick)
          document.removeEventListener('click', handleClickOutside)
          toggleListeners.forEach(({ toggle, handleChange }) => {
            toggle.removeEventListener('change', handleChange);
          });
        }
      }
    }
  }, [patientId, patient])

  useEffect(() => {
    // Add all the original JavaScript functionality
    const script = document.createElement('script')
    script.innerHTML = `
      function switchTab(tabId) {
        // Only switch if the tab exists and is visible
        const targetTab = document.getElementById('tab-' + tabId);
        if (!targetTab || targetTab.classList.contains('hidden')) {
          return;
        }
        
        document.querySelectorAll('.tab-btn').forEach(button => { 
          button.classList.remove('tab-active'); 
          button.classList.add('text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300'); 
        });
        document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
        const activeButton = document.getElementById('tab-' + tabId);
        if(activeButton) { 
          activeButton.classList.add('tab-active'); 
          activeButton.classList.remove('text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300'); 
        }
        const activeContent = document.getElementById('content-' + tabId);
        if(activeContent) { 
          activeContent.classList.remove('hidden'); 
        }
        // Sync active state to corresponding summary card
        try {
          const keys = ['pdpm','diagnosis','medications','respiratory'];
          keys.forEach(k => {
            const card = document.getElementById('card-' + k);
            if (card) card.classList.remove('active-linked');
          });
          const activeCard = document.getElementById('card-' + tabId);
          if (activeCard && !activeCard.classList.contains('hidden')) activeCard.classList.add('active-linked');
        } catch (e) {}
      }

      function navigateTo(tabId) {
        switchTab(tabId);
        const mainContainer = document.querySelector('.main');
        const contentEl = document.getElementById('content-' + tabId);
        const tabsEl = document.querySelector('#tabs-container');
        
        if (contentEl && mainContainer && tabsEl) {
          // Calculate position relative to the main container
          const containerRect = mainContainer.getBoundingClientRect();
          const contentRect = contentEl.getBoundingClientRect();
          const currentScroll = mainContainer.scrollTop;
          
          // Account for only sticky tabs (header and summary cards scroll away)
          const tabsHeight = tabsEl.getBoundingClientRect().height;
          const stickyHeaderHeight = tabsHeight + 10; // Small buffer
          
          const targetScroll = currentScroll + contentRect.top - containerRect.top - stickyHeaderHeight;
          
          mainContainer.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
        }
      }

      function updateTabsOffset() {
        // Tabs are now fixed at top: 0, no dynamic positioning needed
        // This function kept for compatibility but does nothing
      }

      function toggleDetails(row) {
        const detailsRow = row.nextElementSibling;
        if (detailsRow && detailsRow.classList.contains('details-row')) {
          row.classList.toggle('expanded');
          detailsRow.classList.toggle('hidden');
        }
      }

      function togglePdpmDetails(cardType) {
        const button = document.getElementById('pdpm-toggle-' + cardType);
        const details = document.getElementById('pdpm-details-' + cardType);
        const expanded = details.classList.toggle('expanded');
        button.querySelector('span').textContent = expanded ? 'Hide breakdown' : 'Show breakdown';
        const icon = button.querySelector('svg');
        if (expanded) {
          icon.classList.add('rotate-180');
        } else {
          icon.classList.remove('rotate-180');
        }
      }

      function toggleEdit(button) {
        const container = button.closest('.editable-container');
        if (!container) {
          const parentRow = button.closest('tr') || button.closest('li');
          if (!parentRow) return;
          const editableContainer = parentRow.querySelector('.editable-container');
          if (!editableContainer) return;
          handleToggle(editableContainer);
        } else {
          handleToggle(container);
        }
      }

      function handleToggle(container) {
        const textSpan = container.querySelector('.editable-text');
        const inputField = container.querySelector('input[type="text"]');
        const editButton = container.parentElement.querySelector('.edit-icon');
        const saveButton = container.parentElement.querySelector('button:not(.edit-icon)');
        if (!textSpan || !inputField || !editButton || !saveButton) return;
        const isEditing = textSpan.classList.contains('hidden');
        if (isEditing) {
          textSpan.textContent = inputField.value;
          textSpan.classList.remove('hidden');
          inputField.classList.add('hidden');
          editButton.classList.remove('hidden');
          saveButton.classList.add('hidden');
        } else {
          inputField.value = textSpan.textContent;
          textSpan.classList.add('hidden');
          inputField.classList.remove('hidden');
          inputField.focus();
          editButton.classList.add('hidden');
          saveButton.classList.remove('hidden');
        }
      }


      // Initialize
      setTimeout(() => {
        updateTabsOffset();
      }, 100);
      window.addEventListener('resize', updateTabsOffset);
      
      const cardToggles = document.querySelectorAll('#customize-menu input[type="checkbox"]');
      cardToggles.forEach(toggle => {
        const cardKey = toggle.dataset.card;
        const card = document.getElementById('card-' + cardKey);
        
        if (card && !card.classList.contains('hidden')) {
            toggle.checked = true;
        }

        toggle.addEventListener('change', () => {
          const tabButton = document.getElementById('tab-' + cardKey);
          const tabContent = document.getElementById('content-' + cardKey);

          if (card) {
            card.classList.toggle('hidden', !toggle.checked);
          }
          if (tabButton) {
            tabButton.classList.toggle('hidden', !toggle.checked);
          }
        });
      });
    `
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const htmlContent = `
    <style>
      body {
        font-family: 'Inter', sans-serif;
      }
      /* Custom styles for active tabs */
      .tab-active {
        border-bottom-color: #095d7e !important;
        color: #095d7e !important;
        font-weight: 600;
      }
      .edit-icon {
        cursor: pointer;
        opacity: 0.5;
        transition: opacity 0.2s;
      }
      .edit-icon:hover {
        opacity: 1;
      }
      .expand-icon {
        transition: transform 0.3s ease;
      }
      .details-row.hidden {
        display: none;
      }
      .expandable-row.expanded .expand-icon {
        transform: rotate(90deg);
      }
      .pdpm-details-expandable {
        transition: max-height 0.5s ease-in-out, margin-top 0.5s ease-in-out;
        max-height: 0;
        overflow: hidden;
      }
      .pdpm-details-expandable.expanded {
        max-height: 500px; /* Adjust as needed */
        margin-top: 0.75rem;
      }
      /* Linked Tab/Card experiment */
      .card-linked {
        position: relative;
        transition: all 400ms cubic-bezier(0.23, 1, 0.320, 1);
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)) !important;
        backdrop-filter: blur(30px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(30px) saturate(180%) !important;
        border-radius: 1rem !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 
          0 6px 20px 0 rgba(0, 0, 0, 0.06),
          0 2px 12px 0 rgba(0, 0, 0, 0.04),
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -1px 0 rgba(255, 255, 255, 0.05) !important;
      }
      .card-bookmark {
        position: absolute;
        left: -4px;
        top: 16px;
        width: 10px;
        height: 26px;
        background: #095d7e;
        border-top-right-radius: 3px;
        clip-path: polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%);
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        z-index: 5;
      }
      
      @keyframes tabPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.6); }
        100% { transform: scale(1); }
      }
      .tab-dot { transition: transform 0.15s ease, background-color 300ms ease-in-out; display: none; }
      .tab-dot.pulsing { animation: tabPulse 0.6s ease-in-out; }
      .active-linked {
        box-shadow: 0 0 0 2px #095d7e, 0 2px 6px rgba(0,0,0,0.06);
      }
      .hover-linked {
        border-color: #095d7e;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08)) !important;
        backdrop-filter: blur(35px) saturate(200%) !important;
        -webkit-backdrop-filter: blur(35px) saturate(200%) !important;
        box-shadow: 
          0 10px 30px 0 rgba(0, 0, 0, 0.08),
          0 4px 16px 0 rgba(0, 0, 0, 0.06),
          inset 0 1px 0 rgba(255, 255, 255, 0.3),
          inset 0 -1px 0 rgba(255, 255, 255, 0.08) !important;
        transform: translateY(-4px) scale(1.02);
      }
      .card-linked:hover {
        border-color: #095d7e;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08)) !important;
        backdrop-filter: blur(35px) saturate(200%) !important;
        -webkit-backdrop-filter: blur(35px) saturate(200%) !important;
        box-shadow: 
          0 10px 30px 0 rgba(0, 0, 0, 0.08),
          0 4px 16px 0 rgba(0, 0, 0, 0.06),
          inset 0 1px 0 rgba(255, 255, 255, 0.3),
          inset 0 -1px 0 rgba(255, 255, 255, 0.08) !important;
        transform: translateY(-4px) scale(1.02);
      }
      .tab-linked {
        border-bottom-color: #095d7e !important;
        color: #095d7e !important;
        font-weight: 600 !important;
      }
      .tab-btn { transition: color 300ms ease-in-out, border-bottom-color 300ms ease-in-out; }
      /* Toggle Switch */
      .toggle-bg:after {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        background: white;
        border: 1px solid #d1d5db;
        border-radius: 9999px;
        height: 20px;
        width: 20px;
        transition: all 0.2s;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      }
      input:checked + .toggle-bg:after {
        transform: translateX(100%);
        border-color: white;
      }
      input:checked + .toggle-bg {
        background-color: #469c46;
      }
      .bar-segment {
        transition: width 0.5s ease-in-out;
      }
      .price-text {
        transition: opacity 0.25s ease-in-out;
      }
      
      /* Static Diagnosis Cards */
      .diagnosis-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06)) !important;
        backdrop-filter: blur(15px) saturate(120%) !important;
        -webkit-backdrop-filter: blur(15px) saturate(120%) !important;
        border-radius: 0.5rem !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        box-shadow: 
          0 2px 8px 0 rgba(0, 0, 0, 0.04),
          0 1px 3px 0 rgba(0, 0, 0, 0.02),
          inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
      }
      
      .glass-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)) !important;
        backdrop-filter: blur(30px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(30px) saturate(180%) !important;
        border-radius: 1rem !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 
          0 6px 20px 0 rgba(0, 0, 0, 0.06),
          0 2px 12px 0 rgba(0, 0, 0, 0.04),
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -1px 0 rgba(255, 255, 255, 0.05) !important;
      }
      
      .bg-white {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)) !important;
        backdrop-filter: blur(30px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(30px) saturate(180%) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 
          0 6px 20px 0 rgba(0, 0, 0, 0.06),
          0 2px 12px 0 rgba(0, 0, 0, 0.04),
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -1px 0 rgba(255, 255, 255, 0.05) !important;
      }
      
      .rounded-lg {
        border-radius: 1.2rem !important;
      }
      
      /* Color overrides with direct hex values from color-palette.css */
      .text-yellow-400 { color: #ffcc17 !important; }
      .text-gray-300 { color: #c7c7c7 !important; }
      .text-gray-400 { color: #a3a3a3 !important; }
      .text-gray-500 { color: #707070 !important; }
      .text-gray-600 { color: #4d4d4d !important; }
      .text-gray-700 { color: #383838 !important; }
      .text-gray-800 { color: #292929 !important; }
      .text-gray-900 { color: #1f1f1f !important; }
      .text-indigo-600 { color: #095d7e !important; }
      .text-indigo-700 { color: #095d7e !important; }
      .bg-indigo-600 { background-color: #095d7e !important; }
      .hover\\:bg-indigo-700:hover { background-color: #095d7e !important; }
      .border-indigo-500 { border-color: #095d7e !important; }
      .bg-green-500 { background-color: #469c46 !important; }
      .text-green-700 { color: #63993d !important; }
      .text-green-600 { color: #469c46 !important; }
      .bg-green-600 { background-color: #469c46 !important; }
      .border-green-200 { border-color: #afdc8f !important; }
      .bg-green-50 { background-color: #e9f7df !important; }
      .text-amber-700 { color: #cc0000 !important; }
      .border-amber-200 { border-color: #cc3333 !important; }
      .bg-amber-50 { background-color: #f8efef !important; }
      .bg-gray-50 { background-color: #f2f2f2 !important; }
      .hover\\:bg-gray-50:hover { background-color: #f2f2f2 !important; }
      .bg-gray-100 { background-color: #f2f2f2 !important; }
      .bg-gray-200 { background-color: #e0e0e0 !important; }
      .border-gray-200 { border-color: #e0e0e0 !important; }
      .border-gray-300 { border-color: #c7c7c7 !important; }
      .bg-blue-600 { background-color: #4394e5 !important; }
      .bg-blue-500 { background-color: #4394e5 !important; }
      .bg-blue-300 { background-color: #92c5f9 !important; }
      .text-blue-700 { color: #0066cc !important; }
      .bg-purple-500 { background-color: #095d7e !important; }
      .bg-teal-500 { background-color: #63bdbd !important; }
      .bg-teal-300 { background-color: #9ad8d8 !important; }
      .text-teal-700 { color: #37a3a3 !important; }
      .bg-pink-500 { background-color: #14967f !important; }
      .bg-pink-100 { background-color: #bff4e3 !important; }
      .text-pink-700 { color: #09493e !important; }
      .bg-orange-500 { background-color: #cc0000 !important; }
      .bg-orange-300 { background-color: #bbbbbb !important; }
      .text-orange-700 { color: #cc0000 !important; }
      .bg-gray-500 { background-color: #707070 !important; }
      .bg-gray-400 { background-color: #a3a3a3 !important; }
      .bg-red-500 { background-color: #bceba5 !important; }
      
      /* Toggle switch overrides */
      .toggle-bg { background-color: #e0e0e0; }
      input:checked + .toggle-bg { background-color: #095d7e; }
    </style>

    <!-- Hidden SVG definition for the half-star gradient -->
    <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="half-star-gradient">
          <stop offset="50%" stop-color="#ffcc17" />
          <stop offset="50%" stop-color="#c7c7c7" />
        </linearGradient>
      </defs>
    </svg>

    <div class="bg-gray-50 text-gray-800" style="font-family: 'Inter', sans-serif;">
      ${patientId ? `
        <!-- Back Button (only shown when accessed via URL) -->
        <div class="bg-white border-b border-gray-200">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <button 
              onclick="window.history.back()" 
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back to Referrals
            </button>
          </div>
        </div>
      ` : ''}
      
      <!-- Patient Header (Now scrollable) -->
      <header class="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <!-- Patient ID & Alerts Bar -->
        <div id="patient-bar" class="container mx-auto px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 items-center py-3">
            <!-- Left: Patient Info -->
            <div class="md:col-span-1">
              <h1 class="text-lg font-bold text-gray-900">${currentPatient.name}</h1>
              <p class="text-sm text-gray-500">MRN: ${currentPatient.mrn} | ${currentPatient.age} / ${currentPatient.gender}</p>
            </div>
            
            <!-- Center: Clinware Rating -->
            <div id="clinware-rating" class="text-center order-first md:order-none col-span-2 md:col-span-1">
              <p class="text-sm font-medium text-gray-500 mb-1">Clinware Rating</p>
              <div class="flex justify-center items-center space-x-1">
                <!-- Three Filled Stars -->
                <svg class="w-7 h-7 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <svg class="w-7 h-7 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <svg class="w-7 h-7 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <!-- Half Star -->
                <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="url(#half-star-gradient)"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <!-- Empty Star -->
                <svg class="w-7 h-7 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </div>
              <p class="text-sm font-semibold text-gray-700 mt-1">3.5/5</p>
            </div>

            <!-- Right: Actions -->
            <div class="text-right">
              <div class="inline-flex items-center space-x-2">
                <button id="btn-accept" class="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">Accept</button>
                <button id="btn-deny" class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500">Deny</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Key Indicators Strip -->
      <div class="bg-white border-b border-gray-200">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div class="flex items-center space-x-1">
            <span class="text-sm font-medium text-gray-600 mr-3">Key Indicators :</span>
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
              🔴 Allergies Present
            </span>
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              🟢 Isolation Required
            </span>
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
              ⚠️ Clinically Capable
            </span>
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
              ⚠️ Consolidated Billing Exclusion
            </span>
          </div>
        </div>
      </div>

      <!-- Summary Overview Section (Now outside header - will scroll away) -->
      <div id="summary-section" class="bg-gray-100 border-y border-gray-200">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
            <div class="flex justify-end mb-2">
              <div class="relative">
                <button id="customize-btn" class="inline-flex items-center px-3 py-1.5 border border-gray-300 bg-white text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  Customize
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd"/></svg>
                </button>
                <div id="customize-menu" class="hidden absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-md p-3 z-[1000]">
                  <p class="text-xs font-semibold text-gray-500 mb-2">Show cards</p>
                  <div class="space-y-2 text-sm">
                    <label class="flex items-center justify-between"><span>PDPM Analysis</span><input type="checkbox" data-card="pdpm" class="h-4 w-4 text-indigo-600 border-gray-300 rounded"></label>
                    <label class="flex items-center justify-between"><span>Diagnosis</span><input type="checkbox" data-card="diagnosis" class="h-4 w-4 text-indigo-600 border-gray-300 rounded"></label>
                    <label class="flex items-center justify-between"><span>Medications</span><input type="checkbox" data-card="medications" class="h-4 w-4 text-indigo-600 border-gray-300 rounded"></label>
                    <label class="flex items-center justify-between"><span>Respiratory</span><input type="checkbox" data-card="respiratory" class="h-4 w-4 text-indigo-600 border-gray-300 rounded"></label>
                  </div>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              <!-- PDPM Analysis Summary Card -->
              <button id="card-pdpm" onclick="navigateTo('pdpm')" class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-left hover:shadow transition flex flex-col h-full card-linked">
                <span class="card-bookmark" aria-hidden="true"></span>
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-lg font-semibold text-gray-900">PDPM Analysis</h3>
                  <span class="inline-flex items-center text-green-700 text-sm font-semibold">+$119.66<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 10a1 1 0 011-1h6.586L10.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 11-1.414-1.414L12.586 11H6a1 1 0 01-1-1z" clip-rule="evenodd"/></svg></span>
                </div>
                
                <!-- Conservative vs Potential Comparison -->
                <div class="grid grid-cols-2 gap-3 mb-4">
                  <!-- Conservative -->
                  <div class="bg-gray-50 p-3 rounded-lg border">
                    <div class="text-xs font-medium text-gray-600 mb-1">Conservative</div>
                    <div class="text-lg font-bold text-gray-900">$520.87</div>
                    <div class="text-xs text-green-600 font-medium">Profit: $353.31</div>
                    <div class="text-xs text-gray-500">67.8% margin</div>
                  </div>
                  
                  <!-- Potential -->
                  <div class="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div class="text-xs font-medium text-green-700 mb-1">Potential</div>
                    <div class="text-lg font-bold text-green-800">$623.33</div>
                    <div class="text-xs text-green-700 font-medium">Profit: $472.97</div>
                    <div class="text-xs text-green-600">75.9% margin</div>
                  </div>
                </div>
                
                <!-- Profit Improvement Highlight -->
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                  <div class="text-center">
                    <div class="text-xs text-green-700 font-medium">Additional Daily Profit Potential</div>
                    <div class="text-2xl font-bold text-green-800">+$119.66</div>
                    <div class="text-xs text-green-600">33.9% profit increase</div>
                  </div>
                </div>
              </button>

              <!-- Medications Summary Card -->
              <button id="card-medications" onclick="navigateTo('medications')" class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-left hover:shadow transition flex flex-col h-full card-linked">
                <span class="card-bookmark" aria-hidden="true"></span>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">Medications</h3>
                  <span class="text-xs text-gray-500">3 active</span>
                </div>
                <div class="mt-1 text-sm text-gray-600">
                  <p>Daily cost: <span class="font-semibold text-gray-900">$58.40</span></p>
                </div>
                <div class="mt-1 h-2 rounded-full overflow-hidden bg-gray-200">
                  <div class="h-2 bg-green-500" style="width: 70%"></div>
                </div>
                <div class="mt-1 flex items-center justify-between text-[11px] text-gray-600">
                  <span class="text-green-700 font-semibold">Optimized: $41.20</span>
                  <span class="text-green-700 font-semibold">29% lower</span>
                </div>

                <div class="mt-4 text-[11px] text-gray-600 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="inline-flex items-center">
                      <span class="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
                      SINEMET → Carbidopa/Levodopa (generic)
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="inline-flex items-center">
                      <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2"></span>
                      LIPITOR → Atorvastatin (generic)
                    </span>
                  </div>
                </div>

                <p class="mt-4 text-xs text-gray-500">2 generics suggested</p>
              </button>

              <!-- Diagnosis Summary Card -->
              <button id="card-diagnosis" onclick="navigateTo('diagnosis')" class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-left hover:shadow transition flex flex-col h-full card-linked">
                <span class="card-bookmark" aria-hidden="true"></span>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">Diagnosis</h3>
                  <span class="flex items-center space-x-2">
                    <svg class="h-5 w-5" viewBox="0 0 36 36" aria-hidden="true">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="#e0e0e0" stroke-width="4"/>
                      <circle cx="18" cy="18" r="16" fill="none" stroke="#cc0000" stroke-width="4" stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="40"/>
                    </svg>
                    <span class="inline-flex items-center text-amber-700 text-xs font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">1 flag</span>
                  </span>
                </div>
                <div class="mt-2 flex items-start justify-between">
                  <div class="text-sm text-gray-700">
                    <div><span class="text-gray-500">Primary</span>: <span class="font-semibold text-gray-900">B17.0</span> · Acute Infections</div>
                    <div class="mt-1 text-xs text-gray-500">Comorbidities: 2 · Specificity needed for PT/OT</div>
                  </div>
                  <div class="ml-4 shrink-0 text-center">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full border border-amber-200 bg-amber-50">
                      <div>
                        <div class="text-sm font-bold text-amber-700">6 pts</div>
                        <div class="text-[10px] text-amber-700">NTA</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-6 grid grid-cols-3 gap-3 text-center">
                  <div class="diagnosis-card p-3">
                    <p class="text-[10px] font-medium text-gray-600 mb-1">Severe COPD</p>
                    <p class="text-sm font-bold text-gray-800">3</p>
                  </div>
                  <div class="diagnosis-card p-3">
                    <p class="text-[10px] font-medium text-gray-600 mb-1">Diabetes/Insulin</p>
                    <p class="text-sm font-bold text-gray-800">2</p>
                  </div>
                  <div class="diagnosis-card p-3">
                    <p class="text-[10px] font-medium text-gray-600 mb-1">Pancreatitis/IV</p>
                    <p class="text-sm font-bold text-gray-800">1</p>
                  </div>
                </div>
              </button>

              <!-- Respiratory Assessment Summary Card -->
              <button id="card-respiratory" onclick="navigateTo('respiratory')" class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-left hover:shadow transition flex flex-col h-full card-linked">
                <span class="card-bookmark" aria-hidden="true"></span>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">Respiratory</h3>
                  <span class="inline-flex items-center text-green-700 text-xs font-semibold bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Stable</span>
                </div>
                <div class="mt-3 flex items-start justify-between">
                  <div class="text-xs text-gray-600 space-y-1">
                    <div><span class="text-gray-500">Condition</span>: <span class="font-medium text-gray-800">COPD · GOLD II</span></div>
                    <div><span class="text-gray-500">FiO₂</span>: <span class="font-medium text-gray-800">21% (Room Air)</span></div>
                    <div><span class="text-gray-500">Last RT</span>: <span class="font-medium text-gray-800">08:30</span></div>
                    <div><span class="text-gray-500">Ventilator Needed</span>: <span class="font-medium text-gray-800">No</span></div>
                    <div><span class="text-gray-500">Tracheostomy Present</span>: <span class="font-medium text-gray-800">No</span></div>
                    <div><span class="text-gray-500">HFOT Present</span>: <span class="font-medium text-gray-800">No</span></div>
                    <div><span class="text-gray-500">Antimicrobial Resistance</span>: <span class="font-medium text-gray-800">None detected</span></div>
                  </div>
                  <svg class="ml-4 shrink-0 h-16 w-16" viewBox="0 0 56 56" aria-hidden="true">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="#e0e0e0" stroke-width="6" />
                    <circle cx="28" cy="28" r="22" fill="none" stroke="#469c46" stroke-width="6" stroke-linecap="round" stroke-dasharray="138.2" stroke-dashoffset="8.3" transform="rotate(-90 28 28)" />
                    <text x="28" y="26" text-anchor="middle" font-size="12" fill="#1f1f1f" font-weight="700">94%</text>
                    <text x="28" y="36" text-anchor="middle" font-size="9" fill="#707070">SpO₂</text>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Tab Navigation (Sticky at top) -->
      <div id="tabs-container" class="border-b border-gray-200 sticky bg-white/90 backdrop-blur" style="top: -25px; z-index: 50;">
        <nav class="-mb-px flex space-x-6 container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Tabs">
          <button id="tab-pdpm" onclick="switchTab('pdpm')" class="tab-btn tab-active whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm">
            <span class="inline-flex items-center">
              <span class="w-1.5 h-1.5 rounded-sm mr-2 tab-dot" style="background-color: #095d7e"></span>
              PDPM Analysis
            </span>
          </button>
          <button id="tab-medications" onclick="switchTab('medications')" class="tab-btn text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm">
            <span class="inline-flex items-center">
              <span class="w-1.5 h-1.5 rounded-sm mr-2 tab-dot" style="background-color: #4394e5"></span>
              Medications
            </span>
          </button>
          <button id="tab-diagnosis" onclick="switchTab('diagnosis')" class="tab-btn text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm">
            <span class="inline-flex items-center">
              <span class="w-1.5 h-1.5 rounded-sm mr-2 tab-dot" style="background-color: #cc0000"></span>
              Diagnosis
            </span>
          </button>
          <button id="tab-respiratory" onclick="switchTab('respiratory')" class="tab-btn text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm">
            <span class="inline-flex items-center">
              <span class="w-1.5 h-1.5 rounded-sm mr-2 tab-dot" style="background-color: #63bdbd"></span>
              Respiratory Assessment
            </span>
          </button>
          <button id="tab-admin" onclick="switchTab('admin')" class="tab-btn text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm">Administration & History</button>
        </nav>
      </div>

      <!-- Tab Content Panels -->
      <main class="container mx-auto p-4 sm:p-6 lg:p-8">
        <div class="mt-6">
          <!-- PDPM Analysis Panel -->
          <div id="content-pdpm" class="tab-content space-y-8" style="min-height: calc(100vh - 200px);">
            <!-- Scenario Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Conservative (compact) -->
              <div class="glass-card p-3 border border-gray-200 shadow-sm flex flex-col h-full border-l-4 border-gray-300">
                <div class="flex items-center justify-between mb-1">
                  <h3 class="text-sm font-semibold text-gray-800">Conservative</h3>
                  <span class="text-[11px] text-gray-500">Daily</span>
                </div>
                <div class="mt-1 h-3 bg-gray-200 rounded-full overflow-hidden flex">
                  <div class="h-3 bg-red-500" style="width: 32.2%"></div>
                  <div class="h-3 bg-green-500" style="width: 67.8%"></div>
                </div>
                <div class="mt-2 flex items-center justify-between text-[11px] text-gray-600">
                  <div class="flex items-center space-x-3">
                    <span class="inline-flex items-center"><span class="w-2.5 h-2.5 rounded-full bg-red-500 mr-1.5"></span>Cost $167.56 (32.2%)</span>
                    <span class="inline-flex items-center"><span class="w-2.5 h-2.5 rounded-full bg-green-500 mr-1.5"></span>Profit $353.31 (67.8%)</span>
                  </div>
                  <span class="text-xs font-semibold text-gray-900">Total $520.87</span>
                </div>
                <button id="pdpm-toggle-conservative" onclick="togglePdpmDetails('conservative')" class="text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-full px-3 py-1 cursor-pointer mt-3 flex items-center justify-center select-none w-full">
                  <span>Show breakdown</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
                <div id="pdpm-details-conservative" class="pdpm-details-expandable">
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                    <div class="bg-gray-50/50 p-2 rounded">
                      <h4 class="font-semibold text-gray-700 mb-2">Reimbursement Calculation</h4>
                       <div class="space-y-1">
                        <div class="flex justify-between"><span>PT/OT</span> <span class="font-medium">$120.50</span></div>
                        <div class="flex justify-between"><span>SLP</span> <span class="font-medium">$60.20</span></div>
                        <div class="flex justify-between"><span>Nursing</span> <span class="font-medium">$150.00</span></div>
                        <div class="flex justify-between"><span>NTA</span> <span class="font-medium">$90.80</span></div>
                        <div class="flex justify-between"><span>Non Case Mix</span> <span class="font-medium">$110.00</span></div>
                        <div class="flex justify-between border-t pt-1 mt-1 font-semibold"><span>Subtotal</span> <span>$531.50</span></div>
                        <div class="flex justify-between"><span>Adj. Wage Index (1.00x)</span> <span class="font-medium">$531.50</span></div>
                        <div class="flex justify-between"><span>Value Adj. (-2.00%)</span> <span class="font-medium text-red-600">($10.63)</span></div>
                        <div class="flex justify-between border-t pt-1 mt-1 font-bold text-gray-800"><span>Final Reimbursement</span> <span>$520.87</span></div>
                      </div>
                    </div>
                    <div class="bg-gray-50/50 p-2 rounded">
                      <h4 class="font-semibold text-gray-700 mb-2">Cost Calculation</h4>
                       <div class="space-y-1">
                        <div class="flex justify-between"><span>Medication Costs</span> <span class="font-medium">$58.40</span></div>
                        <div class="flex justify-between"><span>Base Patient Cost</span> <span class="font-medium">$88.00</span></div>
                        <div class="flex justify-between"><span>Bariatric Bed<sup>*</sup></span> <span class="font-medium">$11.54</span></div>
                        <div class="flex justify-between"><span>Bariatric Wheelchair<sup>*</sup></span> <span class="font-medium">$5.77</span></div>
                        <div class="flex justify-between"><span>CPAP/BiPAP<sup>*</sup></span> <span class="font-medium">$3.85</span></div>
                        <div class="flex justify-between border-t pt-1 mt-1 font-bold text-gray-800"><span>Total Daily Cost</span> <span>$167.56</span></div>
                      </div>
                    </div>
                  </div>
                  <div class="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200"><span>*One-time equipment costs amortized over 26-day national average stay</span></div>
                </div>
              </div>
              <!-- Potential (compact) -->
              <div class="glass-card p-3 border border-green-200 shadow-sm flex flex-col h-full border-l-4 border-green-500">
                <div class="flex items-center justify-between mb-1">
                  <h3 class="text-sm font-semibold text-green-700">Potential</h3>
                  <span class="text-[11px] text-gray-500">Daily</span>
                </div>
                <div class="mt-1 h-3 bg-gray-200 rounded-full overflow-hidden flex">
                  <div class="h-3 bg-red-500" style="width: 24.1%"></div>
                  <div class="h-3 bg-green-500" style="width: 75.9%"></div>
                </div>
                <div class="mt-2 flex items-center justify-between text-[11px] text-gray-600">
                  <div class="flex items-center space-x-3">
                    <span class="inline-flex items-center"><span class="w-2.5 h-2.5 rounded-full bg-red-500 mr-1.5"></span>Cost $150.36 (24.1%)</span>
                    <span class="inline-flex items-center"><span class="w-2.5 h-2.5 rounded-full bg-green-500 mr-1.5"></span>Profit $472.97 (75.9%)</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <span class="text-xs font-semibold text-gray-900">Total $623.33</span>
                    <button class="text-[11px] font-semibold text-indigo-600 hover:underline">How?</button>
                  </div>
                </div>
                <button id="pdpm-toggle-potential" onclick="togglePdpmDetails('potential')" class="text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-full px-3 py-1 cursor-pointer mt-3 flex items-center justify-center select-none w-full">
                  <span>Show breakdown</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
                <div id="pdpm-details-potential" class="pdpm-details-expandable">
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                    <div class="bg-gray-50/50 p-2 rounded">
                      <h4 class="font-semibold text-gray-700 mb-2">Reimbursement Calculation</h4>
                       <div class="space-y-1">
                        <div class="flex justify-between"><span>PT/OT</span> <span class="font-medium">$150.75</span></div>
                        <div class="flex justify-between"><span>SLP</span> <span class="font-medium">$75.10</span></div>
                        <div class="flex justify-between"><span>Nursing</span> <span class="font-medium">$180.00</span></div>
                        <div class="flex justify-between"><span>NTA</span> <span class="font-medium">$120.20</span></div>
                        <div class="flex justify-between"><span>Non Case Mix</span> <span class="font-medium">$110.00</span></div>
                        <div class="flex justify-between border-t pt-1 mt-1 font-semibold"><span>Subtotal</span> <span>$636.05</span></div>
                        <div class="flex justify-between"><span>Adj. Wage Index (1.00x)</span> <span class="font-medium">$636.05</span></div>
                        <div class="flex justify-between"><span>Value Adj. (-2.00%)</span> <span class="font-medium text-red-600">($12.72)</span></div>
                        <div class="flex justify-between border-t pt-1 mt-1 font-bold text-gray-800"><span>Final Reimbursement</span> <span>$623.33</span></div>
                      </div>
                    </div>
                    <div class="bg-gray-50/50 p-2 rounded">
                      <h4 class="font-semibold text-gray-700 mb-2">Cost Calculation</h4>
                       <div class="space-y-1">
                        <div class="flex justify-between"><span>Medication Costs</span> <span class="font-medium">$41.20</span></div>
                        <div class="flex justify-between"><span>Base Patient Cost</span> <span class="font-medium">$88.00</span></div>
                        <div class="flex justify-between"><span>Bariatric Bed<sup>*</sup></span> <span class="font-medium">$11.54</span></div>
                        <div class="flex justify-between"><span>Bariatric Wheelchair<sup>*</sup></span> <span class="font-medium">$5.77</span></div>
                        <div class="flex justify-between"><span>CPAP/BiPAP<sup>*</sup></span> <span class="font-medium">$3.85</span></div>
                        <div class="flex justify-between border-t pt-1 mt-1 font-bold text-gray-800"><span>Total Daily Cost</span> <span>$150.36</span></div>
                      </div>
                    </div>
                  </div>
                  <div class="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200"><span>*One-time equipment costs amortized over 26-day national average stay</span></div>
                </div>
              </div>
            </div>
            
            <!-- Component Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="glass-card p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 class="font-bold text-gray-900 flex items-center">
                    <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    <span class="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                    Physical & Occupational Therapy
                  </h4>
                  <p class="text-sm text-gray-600 mt-2">Primary Driver: <span class="font-medium text-gray-800">Acute Infections</span></p>
                </div>
                <div class="mt-4">
                  <p class="text-xs text-gray-500 font-medium">CMI Range</p>
                  <div class="w-full rounded-full h-3 mt-2 flex overflow-hidden">
                    <div class="bg-blue-600 h-3" style="width: 34.74%"></div>
                    <div class="bg-blue-300 h-3" style="width: 65.26%"></div>
                  </div>
                  <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span class="font-bold text-blue-700">0.74 <span class="font-normal">(Conservative)</span></span>
                    <span class="font-bold">2.13 <span class="font-normal">(Potential)</span></span>
                  </div>
                </div>
              </div>
              
              <div class="glass-card p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 class="font-bold text-gray-900 flex items-center">
                    <span class="w-2 h-2 rounded-full bg-teal-500 mr-2"></span>
                    Speech-Language Pathology
                  </h4>
                  <p class="text-sm text-gray-600 mt-2">Drivers: <span class="font-medium text-gray-800">Acute Neurologic, Cognitive Impairment</span></p>
                </div>
                <div class="mt-4">
                  <p class="text-xs text-gray-500 font-medium">CMI Range</p>
                  <div class="w-full rounded-full h-3 mt-2 flex overflow-hidden">
                    <div class="bg-teal-500 h-3" style="width: 57.78%"></div>
                    <div class="bg-teal-300 h-3" style="width: 42.22%"></div>
                  </div>
                  <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span class="font-bold text-teal-700">1.93 <span class="font-normal">(Conservative)</span></span>
                    <span class="font-bold">3.34 <span class="font-normal">(Potential)</span></span>
                  </div>
                </div>
              </div>
              
              <div class="glass-card p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 class="font-bold text-gray-900 flex items-center">
                    <span class="w-2 h-2 rounded-full bg-pink-500 mr-2"></span>
                    Nursing
                  </h4>
                  <p class="text-sm text-gray-600 mt-2">Driver: <span class="font-medium text-gray-800">copd shortness breath, diabetes insulin</span></p>
                  <p class="text-xs text-gray-500 mt-1">Path: <span class="bg-gray-100 rounded px-1.5 py-0.5">Special Care High</span><span class="text-gray-400">→</span><span class="bg-gray-100 rounded px-1.5 py-0.5">No Depression</span><span class="text-gray-400">→</span><strong class="bg-pink-100 text-pink-700 rounded px-1.5 py-0.5">HDE2</strong></p>
                </div>
                <div class="mt-4">
                  <p class="text-xs text-gray-500 font-medium">Fixed CMI</p>
                  <div class="w-full rounded-full h-3 mt-2 flex overflow-hidden bg-pink-500"></div>
                  <div class="text-center text-xs text-gray-500 mt-1">
                    <span class="font-bold text-pink-700">2.27</span>
                  </div>
                </div>
              </div>
              
              <div class="glass-card p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 class="font-bold text-gray-900 flex items-center">
                    <span class="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
                    Non-Therapy Ancillary
                  </h4>
                  <p class="text-sm text-gray-600 mt-2">Current Points: <span class="font-medium text-gray-800">7 (2 to next tier)</span></p>
                </div>
                <div class="mt-4">
                  <p class="text-xs text-gray-500 font-medium">CMI Range</p>
                  <div class="w-full rounded-full h-3 mt-2 flex overflow-hidden">
                    <div class="bg-orange-500 h-3" style="width: 56.86%"></div>
                    <div class="bg-orange-300 h-3" style="width: 43.14%"></div>
                  </div>
                  <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span class="font-bold text-orange-700">1.74 <span class="font-normal">(Current)</span></span>
                    <span class="font-bold">3.06 <span class="font-normal">(Max)</span></span>
                  </div>
                </div>
              </div>
              
              <div class="glass-card p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 class="font-bold text-gray-900 flex items-center">
                    <span class="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
                    Non-Case-Mix
                  </h4>
                  <p class="text-sm text-gray-600 mt-2">Standard Component (Room & Board)</p>
                </div>
                <div class="mt-4">
                  <p class="text-xs text-gray-500 font-medium">Fixed Index</p>
                  <div class="w-full rounded-full h-3 mt-2 flex overflow-hidden bg-gray-500"></div>
                  <div class="text-center text-xs text-gray-500 mt-1">
                    <span class="font-bold text-gray-700">1.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Diagnosis Panel -->
          <div id="content-diagnosis" class="tab-content hidden space-y-6" style="min-height: calc(100vh - 200px);">
            <div class="space-y-6">
              <!-- Primary Diagnosis -->
              <div class="glass-card border-l-4 border-indigo-500 shadow-sm">
                <div class="p-5">
                  <h3 class="text-lg font-semibold text-indigo-700 mb-3">Primary Diagnosis</h3>
                  <div class="editable-container">
                    <div class="flex items-start justify-between">
                      <div>
                        <p class="font-medium editable-text">Acute delirium superimposed on presumed Rapidly progressive neurodegenerative condition</p>
                        <input type="text" class="hidden border-gray-300 rounded shadow-sm w-full" value="Acute delirium superimposed on presumed Rapidly progressive neurodegenerative condition">
                        <p class="text-xs text-gray-500 mt-1">ICD-10: <span class="font-semibold text-gray-600">B17.0</span> | Category: <span class="font-semibold text-gray-600">Acute Infections</span> | Confidence: <span class="font-semibold text-gray-600">60%</span></p>
                      </div>
                      <div class="flex items-center space-x-2 ml-4 flex-shrink-0">
                        <button onclick="toggleEdit(this)" class="edit-icon text-gray-400 hover:text-indigo-600">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg>
                        </button>
                        <button onclick="toggleEdit(this)" class="hidden ml-2 text-green-600 hover:text-green-800 text-sm">Save</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Comorbidities Section -->
              <div class="glass-card border-l-4 border-orange-500 shadow-sm" style="height: 400px;">
                <div class="p-5 h-full flex flex-col">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-semibold text-orange-700">Comorbidities</h3>
                    <button class="text-orange-600 hover:text-orange-800 text-sm">
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="flex-1 overflow-y-auto">
                    <div class="space-y-3">
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">E43</p>
                            <p class="text-sm text-gray-700">Severe malnutrition</p>
                          </div>
                          <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Medical Management</span>
                        </div>
                      </div>
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">R13.10</p>
                            <p class="text-sm text-gray-700">Dysphagia</p>
                          </div>
                          <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Return to Provider</span>
                        </div>
                      </div>
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">E87.9</p>
                            <p class="text-sm text-gray-700">Fluid and electrolyte disorder (Hypernatremia and Hypokalemia)</p>
                          </div>
                          <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Medical Management</span>
                        </div>
                      </div>
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">D64.9</p>
                            <p class="text-sm text-gray-700">Anemia</p>
                          </div>
                          <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Medical Management</span>
                        </div>
                      </div>
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">R26.89</p>
                            <p class="text-sm text-gray-700">Impaired mobility</p>
                          </div>
                          <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Return to Provider</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Secondary Diagnosis Section -->
              <div class="glass-card border-l-4 border-purple-500 shadow-sm" style="height: 400px;">
                <div class="p-5 h-full flex flex-col">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-semibold text-purple-700">Secondary Diagnosis</h3>
                    <button class="text-purple-600 hover:text-purple-800 text-sm">
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="flex-1 overflow-y-auto">
                    <div class="space-y-3">
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">E87.0</p>
                            <p class="text-sm text-gray-700">Hypernatremia</p>
                            <p class="text-xs text-gray-500">Medical Management</p>
                          </div>
                          <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">active</span>
                        </div>
                      </div>
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">D72.829</p>
                            <p class="text-sm text-gray-700">Leukocytosis, unspecified type</p>
                            <p class="text-xs text-gray-500">Medical Management</p>
                          </div>
                          <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">active</span>
                        </div>
                      </div>
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">E43</p>
                            <p class="text-sm text-gray-700">Severe malnutrition</p>
                            <p class="text-xs text-gray-500">Medical Management</p>
                          </div>
                          <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">active</span>
                        </div>
                      </div>
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">D53.1</p>
                            <p class="text-sm text-gray-700">Macrocytic anemia</p>
                            <p class="text-xs text-gray-500">Medical Management</p>
                          </div>
                          <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">active</span>
                        </div>
                      </div>
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">E87.6</p>
                            <p class="text-sm text-gray-700">Hypokalemia</p>
                            <p class="text-xs text-gray-500">Medical Management</p>
                          </div>
                          <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">active</span>
                        </div>
                      </div>
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">R13.19</p>
                            <p class="text-sm text-gray-700">Dysphagia to solids and liquids</p>
                            <p class="text-xs text-gray-500">Return to Provider</p>
                          </div>
                          <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">active</span>
                        </div>
                      </div>
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">R26.89</p>
                            <p class="text-sm text-gray-700">Impaired mobility due to medical condition</p>
                            <p class="text-xs text-gray-500">Return to Provider</p>
                          </div>
                          <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">active</span>
                        </div>
                      </div>
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">I10</p>
                            <p class="text-sm text-gray-700">Hypertension</p>
                            <p class="text-xs text-gray-500">Return to Provider</p>
                          </div>
                          <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">chronic</span>
                        </div>
                      </div>
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">E78.5</p>
                            <p class="text-sm text-gray-700">Hyperlipidemia</p>
                            <p class="text-xs text-gray-500">Medical Management</p>
                          </div>
                          <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">chronic</span>
                        </div>
                      </div>
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">F10.20</p>
                            <p class="text-sm text-gray-700">Alcoholism</p>
                            <p class="text-xs text-gray-500">Medical Management</p>
                          </div>
                          <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">chronic</span>
                        </div>
                      </div>
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">F17.200</p>
                            <p class="text-sm text-gray-700">Tobacco use disorder</p>
                            <p class="text-xs text-gray-500">Return to Provider</p>
                          </div>
                          <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">chronic</span>
                        </div>
                      </div>
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">K56.60</p>
                            <p class="text-sm text-gray-700">Bowel obstruction</p>
                            <p class="text-xs text-gray-500">Medical Management</p>
                          </div>
                          <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">chronic</span>
                        </div>
                      </div>
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">J40</p>
                            <p class="text-sm text-gray-700">Bronchitis</p>
                            <p class="text-xs text-gray-500">Medical Management</p>
                          </div>
                          <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">resolved</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Top NTA Summary Section -->
              <div class="glass-card border-l-4 border-teal-500 shadow-sm" style="height: 400px;">
                <div class="p-5 h-full flex flex-col">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-semibold text-teal-700">Top NTA Summary</h3>
                    <button class="text-teal-600 hover:text-teal-800 text-sm">
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="flex-1 overflow-y-auto">
                    <div class="space-y-3">
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">E43</p>
                            <p class="text-sm text-gray-700">Severe malnutrition</p>
                            <p class="text-xs text-gray-500">Active Diagnoses: Malnutrition Code</p>
                          </div>
                          <span class="text-sm font-semibold text-gray-900">1</span>
                        </div>
                      </div>
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">D72.829</p>
                            <p class="text-sm text-gray-700">Leukocytosis, unspecified type</p>
                            <p class="text-xs text-gray-500">Disorders of Immunity—Except: RxCC97: Immune Disorders</p>
                          </div>
                          <span class="text-sm font-semibold text-gray-900">1</span>
                        </div>
                      </div>
                      <div class="border-b border-gray-200 pb-3">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <p class="font-medium text-gray-900">E78.5</p>
                            <p class="text-sm text-gray-700">Hyperlipidemia</p>
                            <p class="text-xs text-gray-500">Specified Hereditary Metabolic/Immune Disorders</p>
                          </div>
                          <span class="text-sm font-semibold text-gray-900">1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Medications Panel -->
          <div id="content-medications" class="tab-content hidden space-y-6" style="min-height: calc(100vh - 200px);">
            <!-- Cost Source Attribution -->
            <div class="flex justify-end mb-4">
              <div class="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 flex items-center">
                <svg class="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm font-medium text-blue-800">Medication cost source: XYZ Pharmacy</span>
              </div>
            </div>

            <!-- Current Medications Section -->
            <div class="glass-card border-l-4 border-green-500 shadow-sm" style="height: 400px;">
              <div class="p-5 h-full flex flex-col">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-lg font-semibold text-green-700">Current Medications</h3>
                  <button class="text-green-600 hover:text-green-800 text-sm">
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                </div>
                <div class="flex-1 overflow-y-auto">
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead class="bg-gray-50 text-xs text-gray-700 uppercase sticky top-0">
                        <tr>
                          <th class="px-3 py-2 text-left">Name</th>
                          <th class="px-3 py-2 text-left">Dosage</th>
                          <th class="px-3 py-2 text-left">Frequency</th>
                          <th class="px-3 py-2 text-left">Indication</th>
                          <th class="px-3 py-2 text-left">Cost</th>
                        </tr>
                      </thead>
                      <tbody class="text-gray-600">
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">TYLENOL</td>
                          <td class="px-3 py-3">650 mg</td>
                          <td class="px-3 py-3">4 x Daily</td>
                          <td class="px-3 py-3">None</td>
                          <td class="px-3 py-3 text-green-600 font-medium">$0.08</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">PROVENTIL (albuterol sulfate)</td>
                          <td class="px-3 py-3">2 puffs</td>
                          <td class="px-3 py-3">4 x Daily</td>
                          <td class="px-3 py-3">Wheezing</td>
                          <td class="px-3 py-3 text-green-600 font-medium">$1.16</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">cholecalciferol</td>
                          <td class="px-3 py-3">2000 Units</td>
                          <td class="px-3 py-3">1 x Daily</td>
                          <td class="px-3 py-3">established deficiency</td>
                          <td class="px-3 py-3 text-green-600 font-medium">$0.12</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">enoxaparin</td>
                          <td class="px-3 py-3">40 mg</td>
                          <td class="px-3 py-3">1 x Daily</td>
                          <td class="px-3 py-3">DVT PPX</td>
                          <td class="px-3 py-3 text-green-600 font-medium">$8.95</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">glycopyrrolate</td>
                          <td class="px-3 py-3">1 mg</td>
                          <td class="px-3 py-3">3 x Daily</td>
                          <td class="px-3 py-3">None</td>
                          <td class="px-3 py-3 text-green-600 font-medium">$0.30</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">folic acid</td>
                          <td class="px-3 py-3">1 mg</td>
                          <td class="px-3 py-3">1 x Daily</td>
                          <td class="px-3 py-3">None</td>
                          <td class="px-3 py-3 text-green-600 font-medium">$0.02</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">NaCl</td>
                          <td class="px-3 py-3">10 ml</td>
                          <td class="px-3 py-3">3 x Daily</td>
                          <td class="px-3 py-3">None</td>
                          <td class="px-3 py-3 text-green-600 font-medium">$0.06</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">thiamine HCl</td>
                          <td class="px-3 py-3">100 mg</td>
                          <td class="px-3 py-3">1 x Daily</td>
                          <td class="px-3 py-3">None</td>
                          <td class="px-3 py-3 text-green-600 font-medium">$0.05</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">cyanocobalamin</td>
                          <td class="px-3 py-3">1000 mcg</td>
                          <td class="px-3 py-3">1 x Daily</td>
                          <td class="px-3 py-3">None</td>
                          <td class="px-3 py-3 text-green-600 font-medium">$0.09</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">multivitamin</td>
                          <td class="px-3 py-3">1 tablet</td>
                          <td class="px-3 py-3">1 x Daily</td>
                          <td class="px-3 py-3">None</td>
                          <td class="px-3 py-3 text-green-600 font-medium">$0.03</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">docusate sodium</td>
                          <td class="px-3 py-3">100 mg</td>
                          <td class="px-3 py-3">2 x Daily</td>
                          <td class="px-3 py-3">None</td>
                          <td class="px-3 py-3 text-green-600 font-medium">$0.04</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">senna</td>
                          <td class="px-3 py-3">8.6 mg</td>
                          <td class="px-3 py-3">2 x Daily</td>
                          <td class="px-3 py-3">None</td>
                          <td class="px-3 py-3 text-green-600 font-medium">$0.02</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">polyethylene glycol 3350</td>
                        <td class="px-3 py-3">17 g</td>
                          <td class="px-3 py-3">1 x Daily</td>
                          <td class="px-3 py-3">None</td>
                          <td class="px-3 py-3 text-green-600 font-medium">$0.15</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="mt-4 pt-3 border-t border-gray-200">
                    <div class="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                      <span class="text-sm text-gray-600">Total Cost:</span>
                      <span class="text-lg font-semibold text-gray-900">$10.70</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Historical Medications Section -->
            <div class="glass-card border-l-4 border-amber-500 shadow-sm" style="height: 400px;">
              <div class="p-5 h-full flex flex-col">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-lg font-semibold text-amber-700">Historical Medications</h3>
                  <button class="text-amber-600 hover:text-amber-800 text-sm">
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                </div>
                <div class="flex-1 overflow-y-auto">
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead class="bg-gray-50 text-xs text-gray-700 uppercase sticky top-0">
                        <tr>
                          <th class="px-3 py-2 text-left">Name</th>
                          <th class="px-3 py-2 text-left">Dosage</th>
                          <th class="px-3 py-2 text-left">Duration</th>
                          <th class="px-3 py-2 text-left">Discontinued</th>
                          <th class="px-3 py-2 text-left">Reason</th>
                        </tr>
                      </thead>
                      <tbody class="text-gray-600">
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">Metformin</td>
                          <td class="px-3 py-3">500 mg</td>
                          <td class="px-3 py-3">2019-2023</td>
                          <td class="px-3 py-3">Mar 15, 2023</td>
                          <td class="px-3 py-3 text-red-600">Kidney function decline</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">Lisinopril</td>
                          <td class="px-3 py-3">10 mg</td>
                          <td class="px-3 py-3">2020-2023</td>
                          <td class="px-3 py-3">Jan 22, 2023</td>
                          <td class="px-3 py-3 text-amber-600">Switched to alternative</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">Warfarin</td>
                          <td class="px-3 py-3">5 mg</td>
                          <td class="px-3 py-3">2022-2023</td>
                          <td class="px-3 py-3">Feb 10, 2023</td>
                          <td class="px-3 py-3 text-blue-600">Replaced with enoxaparin</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">Prednisone</td>
                          <td class="px-3 py-3">20 mg</td>
                          <td class="px-3 py-3">Dec 2022</td>
                          <td class="px-3 py-3">Dec 28, 2022</td>
                          <td class="px-3 py-3 text-green-600">Course completed</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">Omeprazole</td>
                          <td class="px-3 py-3">40 mg</td>
                          <td class="px-3 py-3">2021-2022</td>
                          <td class="px-3 py-3">Nov 15, 2022</td>
                          <td class="px-3 py-3 text-amber-600">No longer needed</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">Furosemide</td>
                          <td class="px-3 py-3">40 mg</td>
                          <td class="px-3 py-3">2021-2022</td>
                          <td class="px-3 py-3">Aug 20, 2022</td>
                          <td class="px-3 py-3 text-red-600">Electrolyte imbalance</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">Amlodipine</td>
                          <td class="px-3 py-3">5 mg</td>
                          <td class="px-3 py-3">2020-2022</td>
                          <td class="px-3 py-3">Jul 12, 2022</td>
                          <td class="px-3 py-3 text-amber-600">Ankle swelling</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">Gabapentin</td>
                          <td class="px-3 py-3">300 mg</td>
                          <td class="px-3 py-3">2021-2022</td>
                          <td class="px-3 py-3">Jun 05, 2022</td>
                          <td class="px-3 py-3 text-blue-600">Pain resolved</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">Simvastatin</td>
                          <td class="px-3 py-3">20 mg</td>
                          <td class="px-3 py-3">2019-2021</td>
                          <td class="px-3 py-3">Dec 03, 2021</td>
                          <td class="px-3 py-3 text-red-600">Muscle pain</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3 font-medium">Tramadol</td>
                          <td class="px-3 py-3">50 mg</td>
                          <td class="px-3 py-3">2021</td>
                          <td class="px-3 py-3">Sep 18, 2021</td>
                          <td class="px-3 py-3 text-green-600">Short-term use completed</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="mt-4 pt-3 border-t border-gray-200">
                    <div class="flex items-center text-sm text-amber-600">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Historical medications show past 4 years of medication changes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Respiratory Assessment Panel -->
          <div id="content-respiratory" class="tab-content hidden space-y-6" style="min-height: calc(100vh - 200px);">
            <!-- First Row: Ventilator Details & Tracheostomy Details -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <!-- Ventilator Details -->
              <div class="glass-card border-l-4 border-blue-500 shadow-sm h-full">
                <div class="p-5">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-semibold text-blue-700">Ventilator Details</h3>
                    <button class="text-blue-600 hover:text-blue-800 text-sm">
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="space-y-3 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Mode:</span>
                      <span class="font-medium text-gray-800">Not Available</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Breath Type:</span>
                      <span class="font-medium text-gray-800">Not Available</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">FiO₂:</span>
                      <span class="font-medium text-gray-800">0%</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">PEEP:</span>
                      <span class="font-medium text-gray-800">0 cmH₂O</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Days Since Tracheostomy:</span>
                      <span class="font-medium text-gray-800">0</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Sedated:</span>
                      <span class="font-medium text-gray-800">No</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Requires Restraints:</span>
                      <span class="font-medium text-gray-800">No</span>
                    </div>
                  </div>
                  <div class="mt-4 pt-3 border-t border-gray-200">
                    <h4 class="font-medium text-gray-900 mb-2">Compliance Summary</h4>
                    <p class="text-sm text-gray-600">Patient is not on a ventilator.</p>
                  </div>
                </div>
              </div>

              <!-- Tracheostomy Details -->
              <div class="glass-card border-l-4 border-purple-500 shadow-sm h-full">
                <div class="p-5">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-semibold text-purple-700">Tracheostomy Details</h3>
                    <button class="text-purple-600 hover:text-purple-800 text-sm">
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="space-y-3 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Date of Tracheostomy:</span>
                      <span class="font-medium text-gray-800">2024-06-28</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Suction Frequency:</span>
                      <span class="font-medium text-gray-800">Not Available</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">FiO₂:</span>
                      <span class="font-medium text-gray-800">28%</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Days Since Tracheostomy Placed:</span>
                      <span class="font-medium text-gray-800">Not Available</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Date of Last Tracheostomy Change:</span>
                      <span class="font-medium text-gray-800">No</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Suctioning Manageable:</span>
                      <span class="font-medium text-gray-800">Not Available</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Secretions Amount/Thickness/Color:</span>
                      <span class="font-medium text-gray-800">Not Available</span>
                    </div>
                  </div>
                  <div class="mt-4 pt-3 border-t border-gray-200">
                    <h4 class="font-medium text-gray-900 mb-2">Compliance Summary</h4>
                    <p class="text-sm text-gray-600">First tracheostomy change status not documented. Suctioning frequency not documented. Secretion management needs not documented. Item number not documented.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Second Row: High Flow Oxygen Therapy & Drug Resistant Microbe Screening -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <!-- High Flow Oxygen Therapy Details -->
              <div class="glass-card border-l-4 border-cyan-500 shadow-sm h-full">
                <div class="p-5">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-semibold text-cyan-700">High Flow Oxygen Therapy Details</h3>
                    <button class="text-cyan-600 hover:text-cyan-800 text-sm">
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="space-y-3 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Device Type:</span>
                      <span class="font-medium text-gray-800">Not Available</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Flow Rate:</span>
                      <span class="font-medium text-gray-800">0 LPM</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">FiO₂:</span>
                      <span class="font-medium text-gray-800">0%</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Indication:</span>
                      <span class="font-medium text-gray-800">Not Available</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Clinical Stability:</span>
                      <span class="font-medium text-gray-800">Not Available</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Has Humidification:</span>
                      <span class="font-medium text-gray-800">No</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">FiO₂ Compliant:</span>
                      <span class="font-medium text-gray-800">No</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Flow Rate Compliant:</span>
                      <span class="font-medium text-gray-800">No</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Combined Threshold Compliant:</span>
                      <span class="font-medium text-gray-800">No</span>
                    </div>
                  </div>
                  <div class="mt-4 pt-3 border-t border-gray-200">
                    <h4 class="font-medium text-gray-900 mb-2">Compliance Summary</h4>
                    <p class="text-sm text-gray-600">Patient is not on High Flow Oxygen Therapy.</p>
                  </div>
                </div>
              </div>

              <!-- Drug Resistant Microbe Screening -->
              <div class="glass-card border-l-4 border-red-500 shadow-sm h-full">
                <div class="p-5">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-semibold text-red-700">Drug Resistant Microbe Screening</h3>
                    <button class="text-red-600 hover:text-red-800 text-sm">
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead class="bg-gray-50 text-xs text-gray-700 uppercase">
                        <tr>
                          <th class="px-3 py-2 text-left">Organism</th>
                          <th class="px-3 py-2 text-left">Detected</th>
                        </tr>
                      </thead>
                      <tbody class="text-gray-600">
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3">Carbapenem-resistant Enterobacterales</td>
                          <td class="px-3 py-3">
                            <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Not Detected</span>
                          </td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3">MBL-producing Enterobacterales</td>
                          <td class="px-3 py-3">
                            <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Not Detected</span>
                          </td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3">Carbapenem-resistant Pseudomonas aeruginosa</td>
                          <td class="px-3 py-3">
                            <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Not Detected</span>
                          </td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3">Carbapenem-resistant Acinetobacter baumannii</td>
                          <td class="px-3 py-3">
                            <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Not Detected</span>
                          </td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3">Azole-resistant Aspergillus fumigatus</td>
                          <td class="px-3 py-3">
                            <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Not Detected</span>
                          </td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3">Antifungal-resistant Candida, including Candida auris</td>
                          <td class="px-3 py-3">
                            <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Not Detected</span>
                          </td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3">Drug-resistant Neisseria gonorrhoeae</td>
                          <td class="px-3 py-3">
                            <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Not Detected</span>
                          </td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                          <td class="px-3 py-3">Drug-resistant Mycobacterium tuberculosis</td>
                          <td class="px-3 py-3">
                            <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Not Detected</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Administrative & History Panel -->
          <div id="content-admin" class="tab-content hidden space-y-6" style="min-height: calc(100vh - 200px);">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Insurance & Admissions</h3>
                <dl class="text-sm space-y-2">
                  <div class="flex">
                    <dt class="w-1/3 text-gray-500">Primary Insurance</dt>
                    <dd class="w-2/3 font-medium">Not Available</dd>
                  </div>
                  <div class="flex">
                    <dt class="w-1/3 text-gray-500">Prior Auth Required</dt>
                    <dd class="w-2/3 font-medium">No</dd>
                  </div>
                </dl>
              </div>
              <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Hospitalization History</h3>
                <dl class="text-sm space-y-2">
                  <div class="flex">
                    <dt class="w-1/3 text-gray-500">Hospitalized</dt>
                    <dd class="w-2/3 font-medium">2024-09-26</dd>
                  </div>
                  <div class="flex">
                    <dt class="w-1/3 text-gray-500">Discharged</dt>
                    <dd class="w-2/3 font-medium">2024-10-04</dd>
                  </div>
                  <div class="flex">
                    <dt class="w-1/3 text-gray-500">Length of Stay</dt>
                    <dd class="w-2/3 font-medium">8 days</dd>
                  </div>
                  <div class="flex">
                    <dt class="w-1/3 text-gray-500">Physician</dt>
                    <dd class="w-2/3 font-medium">Melissa Rolfsen Wooten, MD</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Surgical History</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                  <thead class="bg-gray-50 text-xs text-gray-700 uppercase">
                    <tr>
                      <th class="px-4 py-2">Procedure</th>
                      <th class="px-4 py-2">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b">
                      <td class="px-4 py-2 font-medium">Joint Replacement</td>
                      <td class="px-4 py-2">majorJointReplacement</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer with Creation and Upload Information -->
      <footer class="mt-8 pt-6 border-t border-gray-200 bg-gray-50">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center text-sm text-gray-600">
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z"></path>
              </svg>
              <span>Created On: 9/11/2025, 6:24:32 PM</span>
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <span>Uploaded By: johndoe@xyzhealth.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `

  return (
    <div 
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
