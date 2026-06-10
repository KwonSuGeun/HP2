# hospital-project (프론트)

Next.js + Redux Saga — **화면/UI만** 담당합니다. DB는 **별도 백엔드**가 처리합니다.

## 프로젝트 구분

| 프로젝트 | 폴더 | 포트 | 역할 |
|----------|------|------|------|
| **프론트 (이 repo)** | `hospital-project` | 3000 | Sidebar, Redux, 화면 |
| **백엔드** | `../hospital-backend` | 8080 | Oracle, MyBatis, API |

## 실행 순서

**1. 백엔드** (IntelliJ 또는 터미널)

```bash
cd ../hospital-backend
mvn spring-boot:run
```

**2. 프론트** — `.env.local` 생성:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

```bash
npm install
npm run dev
```

http://localhost:3000

## 폴더 구조 (프론트만)

```
src/
  app/              # Next.js 라우트
  components/       # Sidebar, MenuItem
  features/menu/    # slice, saga, api
  store/            # Redux store
  lib/axios.ts      # 백엔드 주소 (env)
```

## 데이터 흐름

```
Sidebar → saga → menuApi → http://localhost:8080/api/menus
```

백엔드 상세는 `../hospital-backend/README.md` 참고.
