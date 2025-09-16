// a react componet that renders an html file in same directory as the component
import React from 'react';
// assign this html content to a variable
const htmlContent = `
<!DOCTYPE html>
<html lang="en" class="bg-gray-50">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprehensive PDPM Patient Profile</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="color-palette.css">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        /* Custom styles for active tabs */
        .tab-active {
            border-bottom-color: var(--link-color, var(--pf-t--color--purple--40));
            color: var(--link-color, var(--pf-t--color--purple--40));
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
             background: var(--link-color, var(--pf-t--color--purple--40));
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
            box-shadow: 0 0 0 2px var(--link-color, var(--pf-t--color--purple--40)), 0 2px 6px rgba(0,0,0,0.06);
        }
                 .hover-linked {
             border-color: var(--link-color, var(--pf-t--color--purple--40));
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
             border-color: var(--link-color, var(--pf-t--color--purple--40));
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
            border-bottom-color: var(--link-color, var(--pf-t--color--purple--40)) !important;
            color: var(--link-color, var(--pf-t--color--purple--40)) !important;
            font-weight: 600 !important;
        }
        .tab-btn { transition: color 300ms ease-in-out, border-bottom-color 300ms ease-in-out; }
        /* Toggle Switch */
        .toggle-bg:after {
            content: '';
            @apply absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition shadow-sm;
        }
        input:checked + .toggle-bg:after {
            transform: translateX(100%);
            border-color: white;
        }
        input:checked + .toggle-bg {
            @apply bg-indigo-600;
        }
        .bar-segment {
            transition: width 0.5s ease-in-out;
        }
        .price-text {
            transition: opacity 0.25s ease-in-out;
        }
        .loader {
            border: 2px solid var(--pf-t--color--gray--10);
            border-top: 2px solid #095d7e;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        /* Clinware palette mapping (muted shades) aliased to pf tokens */
        :root {
            --cw-blue-30: var(--pf-t--color--blue--30);
            --cw-blue-40: var(--pf-t--color--blue--40);
            --cw-blue-50: var(--pf-t--color--blue--50);
            --cw-purple-30: #095d7e;
            --cw-purple-40: #095d7e;
            --cw-purple-50: #095d7e;
            --cw-teal-30: var(--pf-t--color--teal--30);
            --cw-teal-40: var(--pf-t--color--teal--40);
            --cw-teal-50: var(--pf-t--color--teal--50);
            --cw-green-10: var(--pf-t--color--green--10);
            --cw-green-30: var(--pf-t--color--green--30);
            --cw-green-40: var(--pf-t--color--green--40);
            --cw-green-50: var(--pf-t--color--green--50);
            --cw-orange-10: var(--pf-t--color--orange--10);
            --cw-orange-20: var(--pf-t--color--orange--20);
            --cw-orange-30: var(--pf-t--color--orange--30);
            --cw-orange-40: var(--pf-t--color--orange--40);
            --cw-orange-50: var(--pf-t--color--orange--50);
            --cw-red-30: var(--pf-t--color--red--30);
            --cw-red-40: var(--pf-t--color--red--40);
            --cw-red-orange-40: var(--pf-t--color--red-orange--40);
            --cw-red-orange-50: var(--pf-t--color--red-orange--50);
            --cw-gray-20: var(--pf-t--color--gray--20);
            --cw-gray-30: var(--pf-t--color--gray--30);
            --cw-gray-40: var(--pf-t--color--gray--40);
            --cw-gray-50: var(--pf-t--color--gray--50);
            --cw-yellow-20: var(--pf-t--color--yellow--20);
            --cw-yellow-30: var(--pf-t--color--yellow--30);
            --cw-yellow-40: var(--pf-t--color--yellow--40);
        }
        /* Tailwind utility overrides to muted palette */
        .text-yellow-400 { color: var(--cw-yellow-30) !important; }
        .text-gray-300 { color: var(--cw-gray-30) !important; }
        .text-gray-400 { color: var(--cw-gray-40) !important; }
        .text-gray-500 { color: var(--cw-gray-50) !important; }
        .text-gray-600 { color: var(--pf-t--color--gray--60) !important; }
        .text-gray-700 { color: var(--pf-t--color--gray--70) !important; }
        .text-gray-800 { color: var(--pf-t--color--gray--80) !important; }
        .text-gray-900 { color: var(--pf-t--color--gray--90) !important; }
        .text-indigo-600 { color: var(--cw-purple-40) !important; }
        .text-indigo-700 { color: var(--cw-purple-50) !important; }
        .bg-indigo-600 { background-color: var(--cw-purple-40) !important; }
        .hover\:bg-indigo-700:hover { background-color: var(--cw-purple-50) !important; }
        .border-indigo-500 { border-color: #095d7e !important; }
        .focus\:ring-indigo-500:focus { --tw-ring-color: var(--cw-purple-40) !important; }
        .peer-focus\:ring-indigo-300:focus { --tw-ring-color: var(--cw-purple-30) !important; }
        .focus\:ring-red-500:focus { --tw-ring-color: var(--cw-red-30) !important; }
        .bg-green-500 { background-color: var(--cw-green-40) !important; }
        .text-green-700 { color: var(--cw-green-50) !important; }
        .text-green-600 { color: var(--cw-green-40) !important; }
        .bg-green-600 { background-color: var(--cw-green-40) !important; }
        .border-green-200 { border-color: var(--cw-green-30) !important; }
        .bg-green-50 { background-color: var(--cw-green-10) !important; }
        .text-amber-700 { color: var(--cw-orange-50) !important; }
        .border-amber-200 { border-color: var(--cw-orange-20) !important; }
        .bg-amber-50 { background-color: var(--cw-orange-10) !important; }
        .bg-gray-50 { background-color: var(--pf-t--color--gray--10) !important; }
        .hover\:bg-gray-50:hover { background-color: var(--pf-t--color--gray--10) !important; }
        .bg-gray-100 { background-color: var(--pf-t--color--gray--10) !important; }
        .bg-gray-200 { background-color: var(--pf-t--color--gray--20) !important; }
        .border-gray-200 { border-color: var(--pf-t--color--gray--20) !important; }
        .border-gray-300 { border-color: var(--cw-gray-30) !important; }
        .bg-blue-600 { background-color: var(--cw-blue-40) !important; }
        .bg-blue-500 { background-color: var(--cw-blue-40) !important; }
        .bg-blue-300 { background-color: var(--cw-blue-30) !important; }
        .text-blue-700 { color: var(--cw-blue-50) !important; }
        .bg-purple-500 { background-color: var(--cw-purple-40) !important; }
        .bg-teal-500 { background-color: var(--cw-teal-40) !important; }
        .bg-teal-300 { background-color: var(--cw-teal-30) !important; }
        .text-teal-700 { color: var(--cw-teal-50) !important; }
        .bg-pink-500 { background-color: var(--cw-red-orange-40) !important; }
        .bg-pink-100 { background-color: var(--pf-t--color--red-orange--10) !important; }
        .text-pink-700 { color: var(--cw-red-orange-50) !important; }
        .bg-orange-500 { background-color: var(--cw-orange-40) !important; }
        .bg-orange-300 { background-color: var(--cw-orange-30) !important; }
        .text-orange-700 { color: var(--cw-orange-50) !important; }
        .bg-gray-500 { background-color: var(--cw-gray-50) !important; }
        .bg-gray-400 { background-color: var(--cw-gray-40) !important; }
        .bg-red-500 { background-color: #bceba5 !important; }
        .bg-purple-500 { background-color: #095d7e !important; }
        
        /* Custom Premium Scrollbar Styling */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        
        ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            margin: 40px 0;
        }
        
        ::-webkit-scrollbar-thumb {
            background: rgba(150, 150, 150, 0.6);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            min-height: 40px;
            margin: 20px 0;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(120, 120, 120, 0.8);
            box-shadow: 0 2px 6px rgba(150, 150, 150, 0.3);
        }
        
        ::-webkit-scrollbar-corner {
            background: transparent;
        }
        
        /* Firefox scrollbar styling */
        html {
            scrollbar-width: thin;
            scrollbar-color: rgba(150, 150, 150, 0.6) rgba(255, 255, 255, 0.05);
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
         
         /* Toggle switch overrides */
         .toggle-bg { background-color: var(--cw-gray-20); }
         input:checked + .toggle-bg { background-color: #095d7e; }
    </style>
</head>
<body class="text-gray-800">

    <!-- Hidden SVG definition for the half-star gradient -->
    <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="half-star-gradient">
          <stop offset="50%" stop-color="var(--cw-yellow-30)" />
          <stop offset="50%" stop-color="var(--cw-gray-30)" />
        </linearGradient>
      </defs>
    </svg>

    <div class="min-h-screen">
        <!-- Persistent Header -->
        <header class="bg-white/80 backdrop-blur-sm border-b border-gray-200">
            <!-- Patient ID & Alerts Bar -->
            <div id="patient-bar" class="container mx-auto px-4 sm:px-6 lg:px-8 sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4 items-center py-3">
                    <!-- Left: Patient Info -->
                    <div class="md:col-span-1">
                        <h1 class="text-lg font-bold text-gray-900">Patient 3</h1>
                        <p class="text-sm text-gray-500">MRN: 4208211 | 73 / F</p>
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
            
            <!-- Summary Overview Section -->
            <div id="summary-section" class="bg-gray-100 border-y border-gray-200">
                <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
                    <div class="flex justify-end mb-2">
                        <div class="relative">
                            <button id="customize-btn" class="inline-flex items-center px-3 py-1.5 border border-gray-300 bg-white text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                Customize
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd"/></svg>
                            </button>
                            <div id="customize-menu" class="hidden absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-md p-3 z-10">
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
                        <button id="card-pdpm" onclick="navigateTo('pdpm')" class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-left hover:shadow transition flex flex-col h-full card-linked" style="--link-color: var(--cw-purple-40);">
                            <span class="card-bookmark" aria-hidden="true"></span>
                            <div class="flex items-center justify-between mb-2">
                                <h3 class="text-lg font-semibold text-gray-900">PDPM Analysis</h3>
                                <span class="inline-flex items-center text-green-700 text-sm font-semibold">+29.5%<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 10a1 1 0 011-1h6.586L10.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 11-1.414-1.414L12.586 11H6a1 1 0 01-1-1z" clip-rule="evenodd"/></svg></span>
                                    </div>
                            <p class="text-sm text-gray-600 mt-1">Current: <span class="font-medium text-gray-800">$550.45</span> · Potential: <span class="font-medium text-gray-800">$712.80</span></p>
                            <div class="mt-3 w-full flex rounded-full overflow-hidden bg-gray-200 h-2">
                                <div class="bg-indigo-600" style="width: 60%"></div>
                                <div class="bg-green-500" style="width: 40%"></div>
                                    </div>
                            <div class="mt-3">
                                <div class="grid grid-cols-2 gap-6 items-center justify-items-center">
                                    <!-- Conservative mix donut -->
                                    <svg class="h-20 w-20" viewBox="0 0 60 60" aria-hidden="true">
                                        <circle cx="30" cy="30" r="18" fill="none" stroke="var(--cw-gray-20)" stroke-width="8" />
                                        <!-- PT -->
                                        <circle cx="30" cy="30" r="18" fill="none" stroke="var(--cw-blue-40)" stroke-width="8" stroke-linecap="butt" transform="rotate(-90 30 30)" stroke-dasharray="16.4 96.7" stroke-dashoffset="0" />
                                        <!-- OT -->
                                        <circle cx="30" cy="30" r="18" fill="none" stroke="var(--cw-purple-40)" stroke-width="8" stroke-linecap="butt" transform="rotate(-90 30 30)" stroke-dasharray="15.38 97.72" stroke-dashoffset="-16.4" />
                                        <!-- SLP -->
                                        <circle cx="30" cy="30" r="18" fill="none" stroke="var(--cw-teal-40)" stroke-width="8" stroke-linecap="butt" transform="rotate(-90 30 30)" stroke-dasharray="10.29 102.81" stroke-dashoffset="-31.78" />
                                        <!-- Nursing -->
                                        <circle cx="30" cy="30" r="18" fill="none" stroke="var(--cw-red-orange-40)" stroke-width="8" stroke-linecap="butt" transform="rotate(-90 30 30)" stroke-dasharray="24.65 88.45" stroke-dashoffset="-42.07" />
                                        <!-- NTA -->
                                        <circle cx="30" cy="30" r="18" fill="none" stroke="var(--cw-orange-40)" stroke-width="8" stroke-linecap="butt" transform="rotate(-90 30 30)" stroke-dasharray="23.75 89.35" stroke-dashoffset="-66.72" />
                                        <!-- Non-Case-Mix -->
                                        <circle cx="30" cy="30" r="18" fill="none" stroke="var(--cw-gray-50)" stroke-width="8" stroke-linecap="butt" transform="rotate(-90 30 30)" stroke-dasharray="22.62 90.48" stroke-dashoffset="-90.47" />
                                        <text x="30" y="33" text-anchor="middle" font-size="9" fill="var(--pf-t--color--gray--90)" font-weight="700">Cons</text>
                                    </svg>
                                    <!-- Potential mix donut -->
                                    <svg class="h-20 w-20" viewBox="0 0 60 60" aria-hidden="true">
                                        <circle cx="30" cy="30" r="18" fill="none" stroke="var(--cw-gray-20)" stroke-width="8" />
                                        <!-- PT -->
                                        <circle cx="30" cy="30" r="18" fill="none" stroke="var(--cw-blue-40)" stroke-width="8" stroke-linecap="butt" transform="rotate(-90 30 30)" stroke-dasharray="18.8 94.3" stroke-dashoffset="0" />
                                        <!-- OT -->
                                        <circle cx="30" cy="30" r="18" fill="none" stroke="var(--cw-purple-40)" stroke-width="8" stroke-linecap="butt" transform="rotate(-90 30 30)" stroke-dasharray="17.42 95.68" stroke-dashoffset="-18.8" />
                                        <!-- SLP -->
                                        <circle cx="30" cy="30" r="18" fill="none" stroke="var(--cw-teal-40)" stroke-width="8" stroke-linecap="butt" transform="rotate(-90 30 30)" stroke-dasharray="11.09 102.01" stroke-dashoffset="-36.22" />
                                        <!-- Nursing -->
                                        <circle cx="30" cy="30" r="18" fill="none" stroke="var(--cw-red-orange-40)" stroke-width="8" stroke-linecap="butt" transform="rotate(-90 30 30)" stroke-dasharray="23.75 89.35" stroke-dashoffset="-47.31" />
                                        <!-- NTA -->
                                        <circle cx="30" cy="30" r="18" fill="none" stroke="var(--cw-orange-40)" stroke-width="8" stroke-linecap="butt" transform="rotate(-90 30 30)" stroke-dasharray="24.4 88.7" stroke-dashoffset="-71.06" />
                                        <!-- Non-Case-Mix -->
                                        <circle cx="30" cy="30" r="18" fill="none" stroke="var(--cw-gray-50)" stroke-width="8" stroke-linecap="butt" transform="rotate(-90 30 30)" stroke-dasharray="17.42 95.68" stroke-dashoffset="-95.46" />
                                        <text x="30" y="33" text-anchor="middle" font-size="9" fill="var(--pf-t--color--gray--90)" font-weight="700">Pot</text>
                                    </svg>
                                    </div>
                                <div class="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-gray-600">
                                    <span class="inline-flex items-center"><span class="w-2 h-2 rounded-sm bg-blue-500 mr-1"></span>PT</span>
                                    <span class="inline-flex items-center"><span class="w-2 h-2 rounded-sm bg-purple-500 mr-1"></span>OT</span>
                                    <span class="inline-flex items-center"><span class="w-2 h-2 rounded-sm bg-teal-500 mr-1"></span>SLP</span>
                                    <span class="inline-flex items-center"><span class="w-2 h-2 rounded-sm bg-pink-500 mr-1"></span>Nursing</span>
                                    <span class="inline-flex items-center"><span class="w-2 h-2 rounded-sm bg-orange-500 mr-1"></span>NTA</span>
                                    <span class="inline-flex items-center"><span class="w-2 h-2 rounded-sm bg-gray-500 mr-1"></span>NCM</span>
                                </div>
                            </div>
                        </button>

                        <!-- Diagnosis Summary Card -->
                        <button id="card-diagnosis" onclick="navigateTo('diagnosis')" class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-left hover:shadow transition flex flex-col h-full card-linked" style="--link-color: var(--cw-orange-40);">
                            <span class="card-bookmark" aria-hidden="true"></span>
                            <div class="flex items-center justify-between mb-2">
                                <h3 class="text-lg font-semibold text-gray-900">Diagnosis</h3>
                                <span class="flex items-center space-x-2">
                                    <svg class="h-5 w-5" viewBox="0 0 36 36" aria-hidden="true">
                                        <circle cx="18" cy="18" r="16" fill="none" stroke="var(--pf-t--color--gray--20)" stroke-width="4"/>
                                        <circle cx="18" cy="18" r="16" fill="none" stroke="var(--pf-t--color--orange--40)" stroke-width="4" stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="40"/>
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

                        <!-- Medications Summary Card -->
                        <button id="card-medications" onclick="navigateTo('medications')" class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-left hover:shadow transition flex flex-col h-full card-linked" style="--link-color: var(--cw-blue-40);">
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

                        <!-- Respiratory Assessment Summary Card -->
                        <button id="card-respiratory" onclick="navigateTo('respiratory')" class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-left hover:shadow transition flex flex-col h-full card-linked" style="--link-color: var(--cw-teal-40);">
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
                                    <circle cx="28" cy="28" r="22" fill="none" stroke="var(--cw-gray-20)" stroke-width="6" />
                                    <circle cx="28" cy="28" r="22" fill="none" stroke="var(--cw-green-40)" stroke-width="6" stroke-linecap="round" stroke-dasharray="138.2" stroke-dashoffset="8.3" transform="rotate(-90 28 28)" />
                                    <text x="28" y="26" text-anchor="middle" font-size="12" fill="var(--pf-t--color--gray--90)" font-weight="700">94%</text>
                                    <text x="28" y="36" text-anchor="middle" font-size="9" fill="var(--pf-t--color--gray--50)">SpO₂</text>
                                </svg>
                        </div>                        </button>
                    </div>
                </div>
            </div>

             <!-- Key Indicators removed per request -->
        </header>

        <!-- Main Content with Tabs -->
        <main class="container mx-auto p-4 sm:p-6 lg:p-8">
            <!-- Tab Navigation -->
            <div id="tabs-container" class="border-b border-gray-200 sticky top-[var(--tabs-top,56px)] z-10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <nav class="-mb-px flex space-x-6 container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Tabs">
                    <button id="tab-pdpm" onclick="switchTab('pdpm')" class="tab-btn tab-active whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm" style="--link-color: var(--cw-purple-40);">
                        <span class="inline-flex items-center">
                            <span class="w-1.5 h-1.5 rounded-sm mr-2 tab-dot" style="background-color: var(--cw-purple-40)"></span>
                            PDPM Analysis
                        </span>
                    </button>
                    <button id="tab-diagnosis" onclick="switchTab('diagnosis')" class="tab-btn text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm" style="--link-color: var(--cw-orange-40);">
                        <span class="inline-flex items-center">
                            <span class="w-1.5 h-1.5 rounded-sm mr-2 tab-dot" style="background-color: var(--cw-orange-40)"></span>
                            Diagnosis
                        </span>
                    </button>
                    <button id="tab-medications" onclick="switchTab('medications')" class="tab-btn text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm" style="--link-color: var(--cw-blue-40);">
                        <span class="inline-flex items-center">
                            <span class="w-1.5 h-1.5 rounded-sm mr-2 tab-dot" style="background-color: var(--cw-blue-40)"></span>
                            Medications
                        </span>
                    </button>
                    <button id="tab-respiratory" onclick="switchTab('respiratory')" class="tab-btn text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm" style="--link-color: var(--cw-teal-40);">
                        <span class="inline-flex items-center">
                            <span class="w-1.5 h-1.5 rounded-sm mr-2 tab-dot" style="background-color: var(--cw-teal-40)"></span>
                            Respiratory Assessment
                        </span>
                    </button>
                                         <button id="tab-admin" onclick="switchTab('admin')" class="tab-btn text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm">Administration & History</button>
                </nav>
            </div>

            <!-- Tab Content Panels -->
            <div class="mt-6">
                <!-- PDPM Analysis Panel -->
                <div id="content-pdpm" class="tab-content space-y-8">
                    <!-- Scenario Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Conservative (compact) -->
                        <div class="glass-card p-3 border border-gray-200 shadow-sm flex flex-col h-full border-l-4 border-gray-300">
                            <div class="flex items-center justify-between mb-1">
                                <h3 class="text-sm font-semibold text-gray-800">Conservative</h3>
                                <span class="text-[11px] text-gray-500">Daily</span>
                            </div>
                            <div class="mt-1 h-3 bg-gray-200 rounded-full overflow-hidden flex">
                                <div class="h-3 bg-red-500" style="width: 75.5%"></div>
                                <div class="h-3 bg-green-500" style="width: 24.5%"></div>
                            </div>
                            <div class="mt-2 flex items-center justify-between text-[11px] text-gray-600">
                                <div class="flex items-center space-x-3">
                                    <span class="inline-flex items-center"><span class="w-2.5 h-2.5 rounded-full bg-red-500 mr-1.5"></span>Cost $415.50 (75.5%)</span>
                                    <span class="inline-flex items-center"><span class="w-2.5 h-2.5 rounded-full bg-green-500 mr-1.5"></span>Profit $134.95 (24.5%)</span>
                                </div>
                                <span class="text-xs font-semibold text-gray-900">Total $550.45</span>
                            </div>
                        </div>
                        <!-- Potential (compact) -->
                        <div class="glass-card p-3 border border-green-200 shadow-sm flex flex-col h-full border-l-4 border-green-500">
                            <div class="flex items-center justify-between mb-1">
                                <h3 class="text-sm font-semibold text-green-700">Potential</h3>
                                <span class="text-[11px] text-gray-500">Daily</span>
                            </div>
                            <div class="mt-1 h-3 bg-gray-200 rounded-full overflow-hidden flex">
                                <div class="h-3 bg-red-500" style="width: 65.7%"></div>
                                <div class="h-3 bg-green-500" style="width: 34.3%"></div>
                            </div>
                            <div class="mt-2 flex items-center justify-between text-[11px] text-gray-600">
                                <div class="flex items-center space-x-3">
                                    <span class="inline-flex items-center"><span class="w-2.5 h-2.5 rounded-full bg-red-500 mr-1.5"></span>Cost $468.20 (65.7%)</span>
                                    <span class="inline-flex items-center"><span class="w-2.5 h-2.5 rounded-full bg-green-500 mr-1.5"></span>Profit $244.60 (34.3%)</span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <span class="text-xs font-semibold text-gray-900">Total $712.80</span>
                                    <button class="text-[11px] font-semibold text-indigo-600 hover:underline">How?</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Actionable Insights removed per request -->
                    <!-- Component Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div class="glass-card p-5 border border-gray-200 shadow-sm flex flex-col justify-between"><div><h4 class="font-bold text-gray-900 flex items-center"><span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span><span class="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>Physical & Occupational Therapy</h4><p class="text-sm text-gray-600 mt-2">Primary Driver: <span class="font-medium text-gray-800">Acute Infections</span></p></div><div class="mt-4"><p class="text-xs text-gray-500 font-medium">CMI Range</p><div class="w-full rounded-full h-3 mt-2 flex overflow-hidden"><div class="bg-blue-600 h-3" style="width: 34.74%"></div><div class="bg-blue-300 h-3" style="width: 65.26%"></div></div><div class="flex justify-between text-xs text-gray-500 mt-1"><span class="font-bold text-blue-700">0.74 <span class="font-normal">(Conservative)</span></span><span class="font-bold">2.13 <span class="font-normal">(Potential)</span></span></div></div></div>
                        <div class="glass-card p-5 border border-gray-200 shadow-sm flex flex-col justify-between"><div><h4 class="font-bold text-gray-900 flex items-center"><span class="w-2 h-2 rounded-full bg-teal-500 mr-2"></span>Speech-Language Pathology</h4><p class="text-sm text-gray-600 mt-2">Drivers: <span class="font-medium text-gray-800">Acute Neurologic, Cognitive Impairment</span></p></div><div class="mt-4"><p class="text-xs text-gray-500 font-medium">CMI Range</p><div class="w-full rounded-full h-3 mt-2 flex overflow-hidden"><div class="bg-teal-500 h-3" style="width: 57.78%"></div><div class="bg-teal-300 h-3" style="width: 42.22%"></div></div><div class="flex justify-between text-xs text-gray-500 mt-1"><span class="font-bold text-teal-700">1.93 <span class="font-normal">(Conservative)</span></span><span class="font-bold">3.34 <span class="font-normal">(Potential)</span></span></div></div></div>
                        <div class="glass-card p-5 border border-gray-200 shadow-sm flex flex-col justify-between"><div><h4 class="font-bold text-gray-900 flex items-center"><span class="w-2 h-2 rounded-full bg-pink-500 mr-2"></span>Nursing</h4><p class="text-sm text-gray-600 mt-2">Driver: <span class="font-medium text-gray-800">copd shortness breath, diabetes insulin</span></p><p class="text-xs text-gray-500 mt-1">Path: <span class="bg-gray-100 rounded px-1.5 py-0.5">Special Care High</span><span class="text-gray-400">&rarr;</span><span class="bg-gray-100 rounded px-1.5 py-0.5">No Depression</span><span class="text-gray-400">&rarr;</span><strong class="bg-pink-100 text-pink-700 rounded px-1.5 py-0.5">HDE2</strong></p></div><div class="mt-4"><p class="text-xs text-gray-500 font-medium">Fixed CMI</p><div class="w-full rounded-full h-3 mt-2 flex overflow-hidden bg-pink-500"></div><div class="text-center text-xs text-gray-500 mt-1"><span class="font-bold text-pink-700">2.27</span></div></div></div>
                        <div class="glass-card p-5 border border-gray-200 shadow-sm flex flex-col justify-between"><div><h4 class="font-bold text-gray-900 flex items-center"><span class="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>Non-Therapy Ancillary</h4><p class="text-sm text-gray-600 mt-2">Current Points: <span class="font-medium text-gray-800">7 (2 to next tier)</span></p></div><div class="mt-4"><p class="text-xs text-gray-500 font-medium">CMI Range</p><div class="w-full rounded-full h-3 mt-2 flex overflow-hidden"><div class="bg-orange-500 h-3" style="width: 56.86%"></div><div class="bg-orange-300 h-3" style="width: 43.14%"></div></div><div class="flex justify-between text-xs text-gray-500 mt-1"><span class="font-bold text-orange-700">1.74 <span class="font-normal">(Current)</span></span><span class="font-bold">3.06 <span class="font-normal">(Max)</span></span></div></div></div>
                        <div class="glass-card p-5 border border-gray-200 shadow-sm flex flex-col justify-between"><div><h4 class="font-bold text-gray-900 flex items-center"><span class="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>Non-Case-Mix</h4><p class="text-sm text-gray-600 mt-2">Standard Component (Room & Board)</p></div><div class="mt-4"><p class="text-xs text-gray-500 font-medium">Fixed Index</p><div class="w-full rounded-full h-3 mt-2 flex overflow-hidden bg-gray-500"></div><div class="text-center text-xs text-gray-500 mt-1"><span class="font-bold text-gray-700">1.00</span></div></div></div>

                    </div>
                    <!-- Rate Composition (moved to bottom) -->
                    <div>
                        <div class="flex justify-between items-center mb-4">
                            <h3 id="rate-composition-title" class="text-lg font-semibold text-gray-900">Conservative Rate Composition</h3>
                            <div class="flex items-center text-sm">
                                <span class="font-medium text-gray-700">Conservative</span>
                                <label for="rate-toggle" class="relative inline-flex items-center cursor-pointer mx-2">
                                    <input type="checkbox" id="rate-toggle" class="sr-only peer">
                                    <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-300 peer-checked:bg-green-600 toggle-bg"></div>
                                </label>
                                <span class="font-medium text-green-700">Potential</span>
                            </div>
                        </div>
                        <div class="w-full flex rounded-full overflow-hidden bg-gray-200 text-xs text-white font-semibold text-center h-6 shadow-inner">
                            <div id="bar-pt" class="bar-segment bg-blue-500 flex items-center justify-center" style="width: 14.5%"><span class="price-text">$80</span></div>
                            <div id="bar-ot" class="bar-segment bg-purple-500 flex items-center justify-center" style="width: 13.6%"><span class="price-text">$75</span></div>
                            <div id="bar-slp" class="bar-segment bg-teal-500 flex items-center justify-center" style="width: 9.1%"><span class="price-text">$50</span></div>
                            <div id="bar-nursing" class="bar-segment bg-pink-500 flex items-center justify-center" style="width: 21.8%"><span class="price-text">$120</span></div>
                            <div id="bar-nta" class="bar-segment bg-orange-500 flex items-center justify-center" style="width: 21%"><span class="price-text">$115</span></div>
                            <div id="bar-nonCaseMix" class="bar-segment bg-gray-500 flex items-center justify-center" style="width: 20%"><span class="price-text">$110</span></div>
                        </div>
                    </div>
                </div>

                <!-- Diagnosis Panel -->
                <div id="content-diagnosis" class="tab-content hidden space-y-6">
                     <div class="space-y-6">
                        <div class="glass-card border-l-4 border-indigo-500 shadow-sm"><div class="p-5"><h3 class="text-lg font-semibold text-indigo-700 mb-3">Primary Diagnosis</h3><div class="editable-container"><div class="flex items-start justify-between"><div><p class="font-medium editable-text">Acute delirium superimposed on presumed Rapidly progressive neurodegenerative condition</p><input type="text" class="hidden border-gray-300 rounded shadow-sm w-full" value="Acute delirium superimposed on presumed Rapidly progressive neurodegenerative condition"><p class="text-xs text-gray-500 mt-1">ICD-10: <span class="font-semibold text-gray-600">B17.0</span> | Category: <span class="font-semibold text-gray-600">Acute Infections</span> | Confidence: <span class="font-semibold text-gray-600">60%</span></p></div><div class="flex items-center space-x-2 ml-4 flex-shrink-0"><button onclick="toggleEdit(this)" class="edit-icon text-gray-400 hover:text-indigo-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg></button><button onclick="toggleEdit(this)" class="hidden ml-2 text-green-600 hover:text-green-800 text-sm">Save</button></div></div></div></div>
                        <div class="glass-card p-5 border border-gray-200 shadow-sm">
                            <h3 class="text-lg font-semibold text-gray-700 mb-4">Secondary Diagnoses & Comorbidities</h3>
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm">
                                    <tbody class="text-gray-600">
                                        <tr class="expandable-row border-b" onclick="toggleDetails(this)">
                                            <td class="p-3 flex items-center cursor-pointer">
                                                <span class="w-2 h-2 rounded-full bg-amber-500 mr-3 flex-shrink-0"></span>
                                                <span class="flex-grow">Type 2 Diabetes Mellitus</span>
                                                <svg class="w-4 h-4 text-gray-400 expand-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                                            </td>
                                        </tr>
                                        <tr class="details-row hidden"><td colspan="1" class="p-3 pl-8 bg-gray-50"><p class="text-xs">ICD-10: <span class="font-semibold">E11.319</span> | Category: <span class="font-semibold">Medical Management</span> | Status: <span class="font-medium bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">Chronic</span> | Confidence: <span class="font-semibold">90%</span></p></td></tr>
                                         <tr class="expandable-row border-b" onclick="toggleDetails(this)">
                                            <td class="p-3 flex items-center cursor-pointer">
                                                <span class="w-2 h-2 rounded-full bg-gray-400 mr-3 flex-shrink-0"></span>
                                                <span class="flex-grow">Fever presenting with conditions classified elsewhere</span>
                                                <svg class="w-4 h-4 text-gray-400 expand-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                                            </td>
                                        </tr>
                                        <tr class="details-row hidden"><td colspan="1" class="p-3 pl-8 bg-gray-50"><p class="text-xs">ICD-10: <span class="font-semibold">R50.81</span> | Category: <span class="font-semibold">Return to Provider</span> | Status: <span class="font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Active</span> | Confidence: <span class="font-semibold">100%</span></p></td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Medications Panel -->
                <div id="content-medications" class="tab-content hidden space-y-6">
                    <div class="glass-card p-5 border border-gray-200 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-900 mb-3">Current Medications</h3>
                        <div class="overflow-x-auto"><table class="w-full text-sm text-left"><thead class="bg-gray-50 text-xs text-gray-700 uppercase"><tr><th class="px-4 py-2">Medication</th><th class="px-4 py-2">Dosage</th><th class="px-4 py-2">Frequency</th><th class="px-4 py-2">Indication</th></tr></thead><tbody><tr class="group"><td class="px-4 py-2 font-medium"><div class="editable-container flex items-center"><span class="editable-text">SINEMET (carbidopa-levodopa)</span><input type="text" class="hidden border-gray-300 rounded shadow-sm" value="SINEMET (carbidopa-levodopa)"><button onclick="toggleEdit(this)" class="ml-2 edit-icon opacity-0 group-hover:opacity-50 hover:opacity-100 text-gray-400 hover:text-indigo-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg></button><button onclick="toggleEdit(this)" class="hidden ml-2 text-green-600 hover:text-green-800 text-sm">Save</button></div></td><td class="px-4 py-2">25-100 mg</td><td class="px-4 py-2">3x daily</td><td class="px-4 py-2">Parkinsonian features</td></tr><tr class="group"><td class="px-4 py-2 font-medium"><div class="editable-container flex items-center"><span class="editable-text">TRELEGY ELLIPTA</span><input type="text" class="hidden border-gray-300 rounded shadow-sm" value="TRELEGY ELLIPTA"><button onclick="toggleEdit(this)" class="ml-2 edit-icon opacity-0 group-hover:opacity-50 hover:opacity-100 text-gray-400 hover:text-indigo-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg></button><button onclick="toggleEdit(this)" class="hidden ml-2 text-green-600 hover:text-green-800 text-sm">Save</button></div></td><td class="px-4 py-2">100-62.5-25 mcg</td><td class="px-4 py-2">1x daily</td><td class="px-4 py-2">COPD</td></tr><tr class="group"><td class="px-4 py-2 font-medium"><div class="editable-container flex items-center"><span class="editable-text">LIPITOR (atorvastatin)</span><input type="text" class="hidden border-gray-300 rounded shadow-sm" value="LIPITOR (atorvastatin)"><button onclick="toggleEdit(this)" class="ml-2 edit-icon opacity-0 group-hover:opacity-50 hover:opacity-100 text-gray-400 hover:text-indigo-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg></button><button onclick="toggleEdit(this)" class="hidden ml-2 text-green-600 hover:text-green-800 text-sm">Save</button></div></td><td class="px-4 py-2">40 mg</td><td class="px-4 py-2">1x daily</td><td class="px-4 py-2">Hyperlipidemia</td></tr></tbody></table></div>
                   </div>
                </div>

                <!-- Respiratory Assessment Panel -->
                <div id="content-respiratory" class="tab-content hidden space-y-6">
                    <div class="glass-card p-5 border border-gray-200 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-900 mb-3">Respiratory Assessment</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div class="space-y-1">
                                <p class="text-gray-500">Condition</p>
                                <p class="font-medium text-gray-800">COPD · GOLD II</p>
                            </div>
                            <div class="space-y-1">
                                <p class="text-gray-500">Oxygen</p>
                                <p class="font-medium text-gray-800">Room Air</p>
                            </div>
                            <div class="space-y-1">
                                <p class="text-gray-500">SpO₂</p>
                                <p class="font-medium text-gray-800">94%</p>
                            </div>
                        </div>
                        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div class="p-4 rounded border border-gray-200">
                                <p class="text-gray-500">Inhaled Therapy</p>
                                <p class="font-medium text-gray-800">TRELEGY ELLIPTA</p>
                            </div>
                            <div class="p-4 rounded border border-gray-200">
                                <p class="text-gray-500">Last RT Session</p>
                                <p class="font-medium text-gray-800">Today · 08:30</p>
                            </div>
                        </div>
                   </div>
                </div>

                <!-- Administrative & History Panel -->
                <div id="content-admin" class="tab-content hidden space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"><h3 class="text-lg font-semibold text-gray-900 mb-3">Insurance & Admissions</h3><dl class="text-sm space-y-2"><div class="flex"><dt class="w-1/3 text-gray-500">Primary Insurance</dt><dd class="w-2/3 font-medium">Not Available</dd></div><div class="flex"><dt class="w-1/3 text-gray-500">Prior Auth Required</dt><dd class="w-2/3 font-medium">No</dd></div></dl></div>
                        <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"><h3 class="text-lg font-semibold text-gray-900 mb-3">Hospitalization History</h3><dl class="text-sm space-y-2"><div class="flex"><dt class="w-1/3 text-gray-500">Hospitalized</dt><dd class="w-2/3 font-medium">2024-09-26</dd></div><div class="flex"><dt class="w-1/3 text-gray-500">Discharged</dt><dd class="w-2/3 font-medium">2024-10-04</dd></div><div class="flex"><dt class="w-1/3 text-gray-500">Length of Stay</dt><dd class="w-2/3 font-medium">8 days</dd></div><div class="flex"><dt class="w-1/3 text-gray-500">Physician</dt><dd class="w-2/3 font-medium">Melissa Rolfsen Wooten, MD</dd></div></dl></div>
                    </div>
                    <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"><h3 class="text-lg font-semibold text-gray-900 mb-3">Surgical History</h3><div class="overflow-x-auto"><table class="w-full text-sm text-left"><thead class="bg-gray-50 text-xs text-gray-700 uppercase"><tr><th class="px-4 py-2">Procedure</th><th class="px-4 py-2">Category</th></tr></thead><tbody><tr class="border-b"><td class="px-4 py-2 font-medium">Joint Replacement</td><td class="px-4 py-2">majorJointReplacement</td></tr></tbody></table></div></div>
                </div>
            </div>
        </main>
    </div>

    <script>
                 function switchTab(tabId) {
             // Only switch if the tab exists and is visible
             const targetTab = document.getElementById('tab-' + ${tabId});
             if (!targetTab || targetTab.classList.contains('hidden')) {
                 return;
             }
             
             document.querySelectorAll('.tab-btn').forEach(button => { button.classList.remove('tab-active'); button.classList.add('text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300'); });
             document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
             const activeButton = document.getElementById('tab-' + ${tabId});
             if(activeButton) { activeButton.classList.add('tab-active'); activeButton.classList.remove('text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300'); }
             const activeContent = document.getElementById('content-' + ${tabId});
             if(activeContent) { activeContent.classList.remove('hidden'); }
             // Sync active state to corresponding summary card
             try {
                 const keys = ['pdpm','diagnosis','medications','respiratory'];
                 keys.forEach(k => {
                     const card = document.getElementById('card-' + ${k});
                     if (card) card.classList.remove('active-linked');
                 });
                 const activeCard = document.getElementById('card-' + ${tabId});
                 if (activeCard && !activeCard.classList.contains('hidden')) activeCard.classList.add('active-linked');
             } catch (e) {}
         }

        function navigateTo(tabId) {
            switchTab(tabId);
            const tabsEl = document.querySelector('#tabs-container');
            const headerEl = document.querySelector('#patient-bar');
            const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 56;
            const tabsTop = tabsEl ? (tabsEl.getBoundingClientRect().top + window.scrollY - headerHeight) : 0;
            document.documentElement.style.setProperty('--tabs-top', headerHeight + 'px');
            window.scrollTo({ top: tabsTop, behavior: 'smooth' });
        }

        // Keep tabs sticky offset aligned with the patient bar height
        function updateTabsOffset() {
            try {
                const headerEl = document.querySelector('#patient-bar');
                const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 56;
                document.documentElement.style.setProperty('--tabs-top', headerHeight + 'px');
            } catch (e) { /* noop */ }
        }

        // Customize cards menu logic with persistence
        const customizeBtn = document.getElementById('customize-btn');
        const customizeMenu = document.getElementById('customize-menu');
        const cardCheckboxes = () => Array.from(document.querySelectorAll('#customize-menu input[type="checkbox"][data-card]'));

                 function loadCardPreferences() {
             try {
                 const raw = localStorage.getItem('card-visibility');
                 const prefs = raw ? JSON.parse(raw) : { pdpm: true, diagnosis: true, medications: true, respiratory: true };
                 let hasVisibleCards = false;
                 
                 for (const key of Object.keys(prefs)) {
                     const el = document.getElementById('card-' + ${key});
                     if (el) {
                         el.classList.toggle('hidden', prefs[key] === false);
                         if (prefs[key] !== false) hasVisibleCards = true;
                     }
                     // Sync corresponding tab
                     const tab = document.getElementById('tab-' + ${key});
                     if (tab) {
                         tab.classList.toggle('hidden', prefs[key] === false);
                     }
                 }
                 
                 // Hide Admin tab if no cards are visible
                 const adminTab = document.getElementById('tab-admin');
                 if (adminTab) {
                     adminTab.classList.toggle('hidden', !hasVisibleCards);
                 }
                 
                 // Hide Clinware Rating if either Medications or Diagnosis card is hidden
                 const rating = document.getElementById('clinware-rating');
                 if (rating) {
                     const hideRating = prefs['medications'] === false || prefs['diagnosis'] === false;
                     rating.classList.toggle('hidden', hideRating);
                 }
                 // sync checkboxes
                 cardCheckboxes().forEach(cb => {
                     const id = cb.getAttribute('data-card');
                     cb.checked = prefs[id] !== false;
                 });
                 // Set first visible card as active
                 setFirstVisibleCardActive();
             } catch (e) {
                 // noop
             }
         }

                 function saveCardPreferences() {
             const prefs = {};
             cardCheckboxes().forEach(cb => {
                 prefs[cb.getAttribute('data-card')] = cb.checked;
             });
             localStorage.setItem('card-visibility', JSON.stringify(prefs));
         }
         
         function setFirstVisibleCardActive() {
             // Find first visible card and set it as active
             const visibleCards = document.querySelectorAll('.card-linked:not(.hidden)');
             if (visibleCards.length > 0) {
                 const firstCard = visibleCards[0];
                 const cardId = firstCard.id.replace('card-', '');
                 switchTab(cardId);
             } else {
                 // If no cards visible, hide all content - no active tab
                 document.querySelectorAll('.tab-btn').forEach(button => { 
                     button.classList.remove('tab-active'); 
                     button.classList.add('text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300'); 
                 });
                 document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
                 document.querySelectorAll('.card-linked').forEach(card => card.classList.remove('active-linked'));
             }
         }

        if (customizeBtn && customizeMenu) {
            customizeBtn.addEventListener('click', () => {
                customizeMenu.classList.toggle('hidden');
            });

            document.addEventListener('click', (e) => {
                if (!customizeMenu.contains(e.target) && !customizeBtn.contains(e.target)) {
                    customizeMenu.classList.add('hidden');
                }
            });

                         document.addEventListener('change', (e) => {
                 const target = e.target;
                 if (target && target.matches('#customize-menu input[type="checkbox"][data-card]')) {
                     const cardId = target.getAttribute('data-card');
                     const el = document.getElementById('card-' + ${cardId});
                     if (el) el.classList.toggle('hidden', !target.checked);
                     
                     // Sync corresponding tab
                     const tab = document.getElementById('tab-' + ${cardId});
                     if (tab) tab.classList.toggle('hidden', !target.checked);
                     
                     // Check if any cards are still visible
                     const visibleCards = document.querySelectorAll('.card-linked:not(.hidden)');
                     const hasVisibleCards = visibleCards.length > 0;
                     
                     // Hide/show Admin tab based on card visibility
                     const adminTab = document.getElementById('tab-admin');
                     if (adminTab) {
                         adminTab.classList.toggle('hidden', !hasVisibleCards);
                     }
                     
                     // Update Clinware Rating visibility on toggle
                     const prefsRaw = localStorage.getItem('card-visibility');
                     const prefs = prefsRaw ? JSON.parse(prefsRaw) : { pdpm: true, diagnosis: true, medications: true, respiratory: true };
                     prefs[cardId] = target.checked;
                     const rating = document.getElementById('clinware-rating');
                     if (rating) {
                         const hideRating = prefs['medications'] === false || prefs['diagnosis'] === false;
                         rating.classList.toggle('hidden', hideRating);
                     }
                     saveCardPreferences();
                     
                     // If current active tab was hidden, switch to first visible
                     const activeTab = document.querySelector('.tab-btn.tab-active');
                     if (activeTab && activeTab.classList.contains('hidden')) {
                         setFirstVisibleCardActive();
                     }
                 }
             });
        }

        function toggleDetails(row) {
            const detailsRow = row.nextElementSibling;
            if (detailsRow && detailsRow.classList.contains('details-row')) {
                row.classList.toggle('expanded');
                detailsRow.classList.toggle('hidden');
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
        
        // Rate Composition Toggle
        const rateToggle = document.getElementById('rate-toggle');
        const rateTitle = document.getElementById('rate-composition-title');
        const barSegments = {
            pt: document.getElementById('bar-pt'),
            ot: document.getElementById('bar-ot'),
            slp: document.getElementById('bar-slp'),
            nursing: document.getElementById('bar-nursing'),
            nta: document.getElementById('bar-nta'),
            nonCaseMix: document.getElementById('bar-nonCaseMix')
        };
        const ratesData = {
            conservative: { 
                title: "Conservative Rate Composition", 
                widths: { pt: '14.5%', ot: '13.6%', slp: '9.1%', nursing: '21.8%', nta: '21%', nonCaseMix: '20%' },
                prices: { pt: '$80', ot: '$75', slp: '$50', nursing: '$120', nta: '$115', nonCaseMix: '$110' }
            },
            potential: { 
                title: "Potential Rate Composition", 
                widths: { pt: '16.8%', ot: '15.4%', slp: '9.8%', nursing: '21%', nta: '21.4%', nonCaseMix: '15.4%' },
                prices: { pt: '$120', ot: '$110', slp: '$70', nursing: '$150', nta: '$153', nonCaseMix: '$110' }
            }
        };

        if (rateToggle) {
            rateToggle.addEventListener('change', (event) => {
                const isPotential = event.target.checked;
                const selectedRate = isPotential ? ratesData.potential : ratesData.conservative;
                
                // Fade out prices
                for (const key in barSegments) {
                    if(barSegments[key]) {
                        const priceSpan = barSegments[key].querySelector('.price-text');
                        if(priceSpan) priceSpan.style.opacity = '0';
                    }
                }
                
                // Update widths and fade in new prices after a delay
                setTimeout(() => {
                    rateTitle.textContent = selectedRate.title;
                    for (const key in barSegments) {
                        if (barSegments[key]) {
                            barSegments[key].style.width = selectedRate.widths[key];
                            const priceSpan = barSegments[key].querySelector('.price-text');
                             if(priceSpan) {
                                priceSpan.textContent = selectedRate.prices[key];
                                priceSpan.style.opacity = '1';
                             }
                        }
                    }
                }, 250); // half of the transition duration
            });
        }

        // Hover/link sync between tabs and summary cards
        (function initLinkedHover(){
            const map = {
                pdpm: { color: getComputedStyle(document.documentElement).getPropertyValue('--cw-purple-40').trim() || getComputedStyle(document.documentElement).getPropertyValue('--pf-t--color--purple--40').trim() },
                diagnosis: { color: getComputedStyle(document.documentElement).getPropertyValue('--cw-orange-40').trim() || getComputedStyle(document.documentElement).getPropertyValue('--pf-t--color--orange--40').trim() },
                medications: { color: getComputedStyle(document.documentElement).getPropertyValue('--cw-blue-40').trim() || getComputedStyle(document.documentElement).getPropertyValue('--pf-t--color--blue--40').trim() },
                respiratory: { color: getComputedStyle(document.documentElement).getPropertyValue('--cw-teal-40').trim() || getComputedStyle(document.documentElement).getPropertyValue('--pf-t--color--teal--40').trim() }
            };
            Object.keys(map).forEach(key => {
                const tab = document.getElementById('tab-' + ${key});
                const card = document.getElementById('card-' + ${key});
                if (!tab || !card) return;
                const color = map[key].color;
                // Card → Tab hover
                card.addEventListener('mouseenter', () => {
                    tab.classList.add('tab-linked');
                    tab.style.setProperty('--link-color', color);
                    card.classList.add('hover-linked');
                    const dot = tab.querySelector('.tab-dot');
                    if (dot) {
                        dot.classList.add('pulsing');
                        setTimeout(() => dot.classList.remove('pulsing'), 650);
                    }
                });
                card.addEventListener('mouseleave', () => {
                    tab.classList.remove('tab-linked');
                    card.classList.remove('hover-linked');
                });
                // Tab → Card hover
                tab.addEventListener('mouseenter', () => {
                    card.classList.add('hover-linked');
                    const dot = tab.querySelector('.tab-dot');
                    if (dot) {
                        dot.classList.add('pulsing');
                        setTimeout(() => dot.classList.remove('pulsing'), 650);
                    }
                });
                tab.addEventListener('mouseleave', () => {
                    card.classList.remove('hover-linked');
                });
            });
            // Ensure the initially active tab's card is highlighted
            const initialActive = document.querySelector('.tab-btn.tab-active');
            if (initialActive) {
                const id = initialActive.id.replace('tab-','');
                const c = document.getElementById('card-' + ${id});
                if (c) c.classList.add('active-linked');
            }
        })();


                 // Load preferences first, then set initial tab
         loadCardPreferences();
         updateTabsOffset();
         window.addEventListener('resize', updateTabsOffset);
    </script>
</body>
</html>

`;


export default function PatientDetails() {
    // add a dangerouslySetInnerHTML prop to the div
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}