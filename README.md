# Evalin Prototype
github repo for evalin prototype
## Tech Stack
- ### Frontend
  - [NextJS](https://nextjs.org/docs)
  - [React](https://react.dev/learn)
  - [TipTapJS](https://tiptap.dev/docs/editor/introduction)
  - [shadcn/ui](https://ui.shadcn.com/docs)
  - [lucide/react](https://lucide.dev/guide/)
- ### Backend
  - [Prisma](https://www.prisma.io/docs/getting-started)
  - [Vercel Postgresql](https://vercel.com/docs/storage/vercel-postgres)
  - [@google/generative-ai](https://github.com/google-gemini/generative-ai-js#readme)
  - [google-spreadsheet](https://theoephraim.github.io/node-google-spreadsheet/#/)
## Folder Structure
```
.
├── app
│   ├── globals.css
│   ├── Interaksi
│   │   └── [MenteeName]
│   │       └── page.tsx
│   ├── layout.tsx
│   ├── ListMentee
│   │   └── page.tsx
│   ├── Login
│   │   ├── page.tsx
│   │   └── Server
│   │       └── CheckUser.ts
│   ├── page.tsx
│   ├── PreInteraksi
│   │   └── [RoomName]
│   │       ├── loading.tsx
│   │       └── page.tsx
│   └── Register
│       ├── page.tsx
│       └── Server
│           └── CreateUser.ts
├── components
│   ├── client
│   │   ├── EditorStyles.css
│   │   ├── Interaksi
│   │   │   ├── LaporanReview.tsx
│   │   │   └── SideBarReview.tsx
│   │   ├── PreInteraksi
│   │   │   ├── AIAssistant.tsx
│   │   │   ├── Laporan.tsx
│   │   │   └── Sidebar.tsx
│   │   └── utils
│   │       └── Toolbar.tsx
│   └── ui
│       ├── accordion.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── checkbox.tsx
│       ├── command.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── popover.tsx
│       ├── radio-group.tsx
│       ├── select.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── toaster.tsx
│       ├── toast.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       ├── tooltip.tsx
│       └── use-toast.ts
├── components.json
├── lib
│   ├── functions
│   │   └── server
│   │       ├── AI
│   │       │   ├── AIFunctions.ts
│   │       │   └── Models
│   │       │       └── GoogleAI.ts
│   │       ├── Database
│   │       │   ├── DocumentFunctions.ts
│   │       │   └── UserFunctions.ts
│   │       ├── Gsheet
│   │       │   ├── GetKPI.ts
│   │       │   └── SaveInteraksi.ts
│   │       └── utils
│   │           └── Topics.ts
│   ├── types.ts
│   └── utils.ts
├── next.config.mjs
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.js
├── prisma
│   └── schema.prisma
├── public
│   ├── next.svg
│   └── vercel.svg
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```
- ### `app/`
  Berisi semua webpage dalam bentuk Folder.
  - `Interaksi/`    
    - `[MenteeName]/`

      Berisi konten untuk page "/Interaksi". page ini digunakan oleh manager dan member untuk One On One setelah member selesai mengisi Pre-Interaksi


  - `ListMentee/`

    Berisi Konten untuk page "/ListMentee". page ini menampilkan urutan member yang pilih current user sebagai manager, dan action untuk melihat hasil Pre-Interaksi member


  - `Login/`

    Berisi konten untuk page "/Login". page ini digunakan untuk user log-in
    
    - `Server`

      Berisi Functions yang digunakan oleh Login page


  - `PreInteraksi/`

    Berisi konten untuk page "/PreInteraksi". page ini digunakan oleh member untuk mengisi komitmen/evidence yang akan dibawa ke Interaksi/ One On One


  - `Register/`
 
     Berisi konten untuk page "/Register". page ini digunakan untuk membuat akun user.
    - `Server/`

      Berisi functions yang digunakan oleh register page


- ### `components/`

  Berisi Component dan ui yang di pakai di webpage

  - `client/`

    Berisi Semua component yang dipakai di client

    -  `Interaksi/`

        Berisi semua component yang dipakai untuk page Interaksi

    - `PreInteraksi/`
   
      Berisi semua component yang dipakai untuk page PreInteraksi
    - `Utils/`
   
      Berisi komponen tambahan

  - `ui/`

    Semua ui component yang dibuat oleh shadcn

- ### `lib/`
  - `Functions/`
    
    Semua fuction yang digunakan dalam website

    - `server/`
      
      Berisi semua function yang digunakan di backend atau server
      
      - `Database/`
      
        Semua function terkait data dalam database

      - `AI/`

        Semua function terkait AI

      - `Gsheet/`

        Semua function terkait google spreadsheet operations

      - `Utils/`

        Data tambahan

    - `types.ts`
      Semua type declaration yang digunakan dalam website


- ### `prisma`
  Berisi schema / struktur table database


  

        
