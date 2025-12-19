# 📦 Inventory Status – 재고 관리 시스템

> **실사용을 목적으로 개발한 소규모 재고 관리 웹 애플리케이션**

이 프로젝트는 컴퓨터 활용에 익숙하지 않는 **아빠가 실제로 사용할 재고 관리 도구**를 목표로 개발했습니다.  
단순한 CRUD 구현에 그치지 않고, **실제 서비스 관점에서의 구조 설계와 확장성**을 고려하여 설계했습니다.

- 빠르게 재고를 추가·수정·삭제할 수 있는 웹 UI
- 백엔드 API + DB 기반의 영속적인 데이터 관리
- 실사용 목적과 포트폴리오 목적을 동시에 만족하는 구조

## ✨ 주요 기능

- 재고 항목 조회
- 재고 추가
- 재고 수정
- 재고 삭제 (확인 모달)
- 실시간 알림 (Toast)
- DB 기반 데이터 영구 저장

## 🧱 기술 스택

### Frontend

- React (Vite)
- JavaScript (ES6+)
- Tailwind CSS
- Fetch API

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL

### Infra / Dev Tool

- Docker (PostgreSQL 컨테이너)
- dotenv (환경 변수 관리)

## 🏗 프로젝트 구조

```bash
inventory-status/
├─ src/                    # 프론트엔드 (React)
│  ├─ api/                 # 백엔드 API 호출 모듈
│  ├─ components/          # UI 컴포넌트
│  ├─ App.jsx
│  └─ main.jsx
├─ .env
│
├─ server/                 # 백엔드 (Express + Prisma)
│  ├─ prisma/
│  │  └─ schema.prisma     # DB 스키마
│  ├─ src/
│  │  ├─ routes/           # API 라우트
│  │  ├─ middleware/       # 인증 / 에러 처리
│  │  └─ index.js          # 서버 엔트리
│  └─ .env
│
└─ README.md
```

## 🔐 인증 방식 (단순하지만 실용적인 구조)

이 프로젝트는 **1인 사용 목적**이기 때문에,  
복잡한 로그인/회원가입 대신 **Admin Token 기반 인증 방식**을 사용했습니다.

### 인증 방식

- 프론트엔드 요청 시 `x-admin-token` 헤더 포함
- 서버에서 토큰 검증 후 API 접근 허용
- 불필요한 인증 복잡도는 줄이면서, 외부 접근은 차단

> ⚠️ 추후 사용자 확장 시 **JWT / 세션 기반 인증**으로 자연스럽게 확장 가능하도록 구조를 설계했습니다.

## 🗄 데이터베이스 설계

### Item 테이블

| 컬럼명      | 타입     | 설명    |
| ----------- | -------- | ------- |
| id          | UUID     | 재고 ID |
| name        | String   | 상품명  |
| quantity    | Int      | 수량    |
| description | String   | 설명    |
| createdAt   | DateTime | 생성일  |
| updatedAt   | DateTime | 수정일  |

## 🚀 실행 방법 (로컬 개발)

### 1️⃣ PostgreSQL 실행 (Docker)

```bash
docker run --name inv-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=inventory -p 5432:5432 -d postgres:16
```

### 2️⃣ 백엔드 실행

```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```

### 3️⃣ 프론트엔드 실행

```bash
npm install
npm run dev
```

## 🌱 설계 의도 & 확장 방향

이 프로젝트는 단순한 CRUD 앱이 아니라,
"**실제로 쓰이는 작은 서비스**"를 목표로 설계했습니다.

### 고려한 점

- UI / 로직 / 서버 책임 분리
- DB 스키마 중심의 API 설계
- 기능 추가 시 구조 변경 최소화

### 확장 아이디어

- 입·출고 이력 관리 (Inventory Log)
- 검색 / 필터 / 정렬 기능
- 사용자 인증 기능 추가
- 배포 (Render / Railway)
