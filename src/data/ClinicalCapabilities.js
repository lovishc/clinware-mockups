export const clinicalCapabilities = [
    {
        "categoryId": 1,
        "categoryName": "Clinical Instability",
        "displayOrder": 1,
        "nonAdmissibles": [
            {
                "id": "550e8400-e29b-41d4-a716-4466554400a1",
                "key": "CLINICAL_SEPSIS",
                "description": "Active sepsis, unstable infections",
                "displayOrder": 1
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400a2",
                "key": "CLINICAL_UNCONTROLLED_VITALS",
                "description": "Uncontrolled vital signs requiring continuous monitoring",
                "displayOrder": 2
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400a3",
                "key": "CLINICAL_HIGH_OXYGEN",
                "description": "High-flow oxygen over 10 liters — evaluate carefully",
                "displayOrder": 3
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400a4",
                "key": "CLINICAL_ADVANCED_RESPIRATORY",
                "description": "Need for advanced respiratory support (e.g., BiPAP, ventilator, or Trilogy machine)",
                "displayOrder": 4
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400a5",
                "key": "CLINICAL_UNCONTROLLED_IV_NARCOTICS",
                "description": "Uncontrolled pain requiring IV narcotics",
                "displayOrder": 5
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400a6",
                "key": "CLINICAL_ONGOING_INVASIVE_PROCEDURES",
                "description": "Ongoing invasive procedures (e.g., chest tubes, central lines)",
                "displayOrder": 6
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400a7",
                "key": "CLINICAL_SUICIDAL_IDEATION",
                "description": "Active suicidal ideation",
                "displayOrder": 7
            }
        ]
    },
    {
        "categoryId": 2,
        "categoryName": "Specialized Equipment or Service Needs",
        "displayOrder": 2,
        "nonAdmissibles": [
            {
                "id": "550e8400-e29b-41d4-a716-4466554400b1",
                "key": "SPECIALIZED_DIALYSIS",
                "description": "Dialysis (unless facility has contracted dialysis services)",
                "displayOrder": 1
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400b2",
                "key": "SPECIALIZED_TPN",
                "description": "TPN (Total Parenteral Nutrition)",
                "displayOrder": 2
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400b3",
                "key": "SPECIALIZED_G_TUBES",
                "description": "G-tubes — case by case based on facility capability",
                "displayOrder": 3
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400b4",
                "key": "SPECIALIZED_UNABLE_SWALLOW_STUDY",
                "description": "Residents unable to pass swallow study with a waiver",
                "displayOrder": 4
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400b5",
                "key": "SPECIALIZED_OSTOMIES",
                "description": "Ostomies — based on SNF capability",
                "displayOrder": 5
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400b6",
                "key": "SPECIALIZED_STAGE4_WOUNDS",
                "description": "Stage 4 wounds — unless SNF wound care certified",
                "displayOrder": 6
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400b7",
                "key": "SPECIALIZED_TRACH_MANAGEMENT",
                "description": "Tracheostomy (Trach) management",
                "displayOrder": 7
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400b8",
                "key": "SPECIALIZED_PUREWICK_CATHETERS",
                "description": "Purewick catheters — if facility not equipped or trained",
                "displayOrder": 8
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400b9",
                "key": "SPECIALIZED_TRILOGY_MACHINES",
                "description": "Residents requiring use of Trilogy machines on any settings",
                "displayOrder": 9
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554401b0",
                "key": "SPECIALIZED_COMPLEX_WOUND_VAC",
                "description": "Complex wound vac therapy",
                "displayOrder": 10
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554401b1",
                "key": "SPECIALIZED_BEHAVIORAL_RESTRAINTS",
                "description": "Behavioral health needs requiring restraints in past 24 hours — evaluate carefully",
                "displayOrder": 11
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554401b2",
                "key": "SPECIALIZED_HIGH_RISK_SUBSTANCE_ABUSE",
                "description": "High-risk alcohol or substance abuse",
                "displayOrder": 12
            }
        ]
    },
    {
        "categoryId": 3,
        "categoryName": "Non-Clinical Barriers",
        "displayOrder": 3,
        "nonAdmissibles": [
            {
                "id": "550e8400-e29b-41d4-a716-4466554400c1",
                "key": "NON_CLINICAL_OVER_300LBS",
                "description": "Residents over 300 pounds (based on SNF equipment and staffing limitations)",
                "displayOrder": 1
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400c2",
                "key": "NON_CLINICAL_UNDER_65",
                "description": "Residents under 65 (if payer, program, or service model restrictions apply)",
                "displayOrder": 2
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400c3",
                "key": "NON_CLINICAL_NON_ENGLISH",
                "description": "Residents who do not speak English — if facility cannot support adequate interpreter services (case by case)",
                "displayOrder": 3
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400c4",
                "key": "NON_CLINICAL_ACTIVE_SMOKERS",
                "description": "Active smokers (if SNF is non-smoking or lacks accommodations)",
                "displayOrder": 4
            }
        ]
    },
    {
        "categoryId": 4,
        "categoryName": "Regulatory or Payer Exclusions",
        "displayOrder": 4,
        "nonAdmissibles": [
            {
                "id": "550e8400-e29b-41d4-a716-4466554400d1",
                "key": "REGULATORY_HOSPICE_PLACEMENT",
                "description": "Awaiting hospice placement",
                "displayOrder": 1
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400d2",
                "key": "REGULATORY_INTELLECTUAL_DISABILITY",
                "description": "Mental Retardation diagnosis (now classified as intellectual disability)",
                "displayOrder": 2
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400d3",
                "key": "REGULATORY_TBI",
                "description": "Traumatic Brain Injury (TBI) — if requiring specialized neurobehavioral care not provided by SNF",
                "displayOrder": 3
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400d4",
                "key": "REGULATORY_AAA",
                "description": "AAA (Abdominal Aortic Aneurysm) — if unstable or requires acute care monitoring",
                "displayOrder": 4
            },
            {
                "id": "550e8400-e29b-41d4-a716-4466554400d5",
                "key": "REGULATORY_MVA",
                "description": "MVA (Motor Vehicle Accident) cases — based on workers comp/MVA insurance complexities",
                "displayOrder": 5
            }
        ]
    }
]