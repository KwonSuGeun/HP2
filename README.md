# HIS Common Domain — Frontend

병원 공통 도메인(메뉴·권한·다국어) Next.js + Redux-Saga 프론트엔드.

## 연관 저장소 (추천 구성)

| 저장소 | 역할 |
|--------|------|
| **[Hospital](https://github.com/tldmsdl1341-ops/Hospital)** (이 repo) | UI + **Oracle SQL** |
| **[Hospital-backend](https://github.com/tldmsdl1341-ops/Hospital-backend)** | Spring Boot API |

팀원은 **두 repo clone** + DB 시드 1회 + 백엔드/프론트 실행.

## 요구 사항

- Node.js 20+
- Java 17+ / Maven (백엔드)
- Oracle 11g XE

## 빠른 시작

### 1. Clone

```powershell
git clone https://github.com/tldmsdl1341-ops/Hospital.git
git clone https://github.com/tldmsdl1341-ops/Hospital-backend.git
```

### 2. DB

[database/README.md](./database/README.md) 참고.

```powershell
cd Hospital
sqlplus hp/비밀번호@localhost/XE @database/oracle/seed_common_domain_realistic.sql
sqlplus hp/비밀번호@localhost/XE @database/oracle/fix_menu_korean_unistr.sql
```

### 3. 백엔드 (포트 9695)

```powershell
cd Hospital-backend
mvn spring-boot:run
```

### 4. 프론트 (포트 3002)

```powershell
cd Hospital
copy .env.example .env.local
npm install
npm run dev
```

브라우저: http://localhost:3002 — 기본 `userId=1` (관리자, 전체 메뉴)

## 프로젝트 구조

- `src/features/common/menu` — Redux-Saga 메뉴 조회
- `src/components/layout` — Sidebar, KO/EN locale
- `database/oracle` — DDL·시드·한글 수정 SQL (**팀 DB 배포물**)

## 환경 변수

| 변수 | 기본값 |
|------|--------|
| `NEXT_PUBLIC_COMMON_API_BASE_URL` | `http://localhost:9695` |

`.env.local`은 Git에 올리지 마세요. `.env.example`만 참고.

## 인증

이 프로젝트는 **로그인/토큰 없음**. 메뉴 API는 `userId` 쿼리로만 조회합니다 (데모: `userId=1`).
