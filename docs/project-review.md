# hospital-project 코드·구조 점검 (2026-06-01)

프론트엔드(`hospital-project`) 전체 파일을 기준으로 현재 상태, 어색한 부분, 개선 제안을 정리한 문서입니다.

---

## 1. 현재 구조 요약

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Providers + MainLayout
│   ├── page.tsx                # 홈
│   ├── providers.tsx           # MUI + Redux
│   └── globals.css
├── components/
│   ├── layout/MainLayout.tsx   # 사이드바 + 본문 레이아웃
│   └── sidebar/                # 사이드바 UI
│       ├── Sidebar.tsx
│       ├── SidebarItem.tsx
│       ├── sidebarIcons.tsx
│       └── sidebarUtils.ts
├── features/sidebar/           # 사이드바 데이터 (Redux)
│   ├── sidebarApi.ts
│   ├── sidebarSlice.ts
│   └── sidebarSaga.ts
├── lib/axios.ts                # API 클라이언트
└── store/
    ├── store.ts
    └── rootSaga.ts
```

### 데이터 흐름

```
Sidebar (mount)
  → dispatch(fetchSidebarRequest)
  → sidebarSaga
  → sidebarApi GET /api/menus
  → sidebarSlice (state.sidebar.items)
  → SidebarItem 렌더
```

### 폴더 역할 (현재 기준)

| 폴더 | 역할 |
|------|------|
| `components/` | 화면에 보이는 React UI |
| `features/` | API + Redux (데이터) |
| `lib/` | 공통 유틸 (axios) |
| `store/` | Redux store / root saga |

---

## 2. 잘 되어 있는 부분

- **UI와 데이터 분리** — `components/sidebar` vs `features/sidebar` 역할이 명확함
- **axios 단일화** — API 주소가 `lib/axios.ts` 한곳에 모임
- **사이드바 로직 단순화** — `sidebarUtils.ts`에 active/펼치기 계산이 이름 있는 함수로 분리됨
- **MainLayout 단순화** — 사용하지 않던 `showSidebar` prop 제거됨
- **빈 폴더 정리** — `src/types`, `src/app/api` 등 미사용 빈 디렉터리 삭제됨
- **env 설정** — `.env.local`에 `NEXT_PUBLIC_API_URL=http://localhost:8081` 사용 중 (백엔드 `application.yml`과 일치)

---

## 3. 어색하거나 이상한 부분

### 🔴 높음 — 문서와 실제 코드 불일치

| 파일 | 문서 내용 | 실제 |
|------|-----------|------|
| `README.md` | `features/menu/`, 포트 **8080** | `features/sidebar/`, 포트 **8081** |
| `AGENTS.md` | 백엔드 포트 **8080** | 백엔드 `application.yml`은 **8081** |
| `../hospital-backend/README.md` | API **8080** | `application.yml`은 **8081** |

→ 새로 합류하는 사람이 README만 보고 설정하면 API 연결 실패 가능.

---

### 🟠 중간 — 네이밍·구조

#### 3-1. `SidebarItem` 이름 충돌

- **타입**: `features/sidebar/sidebarSlice.ts` → `SidebarItem`
- **컴포넌트**: `components/sidebar/SidebarItem.tsx`

같은 이름이라 컴포넌트 파일에서 `SidebarItem as SidebarItemType`으로 우회 import 중.

```ts
import type { SidebarItem as SidebarItemType } from "@/features/sidebar/sidebarSlice";
```

**제안**: 타입을 `SidebarNode` 또는 `SidebarMenu`로 바꾸면 컴포넌트명 `SidebarItem`과 겹치지 않음.

#### 3-2. API 경로 vs 프론트 네이밍

- 프론트: `sidebarApi`, `fetchSidebarApi`
- 백엔드: `GET /api/menus`

기능상 문제 없지만, "sidebar 코드인데 menus API를 부른다"는 점이 처음 보면 헷갈릴 수 있음. (백엔드 테이블/도메인이 `AUTH_MENU`라서 자연스러운 부분도 있음)

#### 3-3. Redux Saga vs 프로젝트 규모

사이드바 목록 **API 1개**만 saga로 처리 중.

- 장점: 나중에 기능 추가 시 패턴 확장 가능
- 단점: 초보 입장에선 slice + saga + store + rootSaga 구조가 다소 무거움

**현재는 동작상 문제 없음.** 다만 "왜 saga?"에 대한 한 줄 주석이 README에 있으면 좋음.

#### 3-4. `store/` 위치

Redux store가 `src/store/`에 있고, sidebar reducer만 등록됨.

- 지금: sidebar 전용 store에 가까움
- 기능 추가 시: `store/` 유지 + `features/*/slice` 패턴은 일반적

**현재는 OK.** 다만 sidebar 하나만 있을 때 store 폴더가 별도로 있는 게 처음엔 다소 분리되어 보일 수 있음.

---

### 🟡 낮음 — 사소하지만 정리 가능

#### 3-5. Tailwind 설치 vs 미사용

`package.json`에 `tailwindcss`, `@tailwindcss/postcss` 있고 `globals.css`에 `@import "tailwindcss"`만 있음.

- 컴포넌트에서 `className="..."` Tailwind 클래스 **사용 없음**
- 스타일은 **MUI `sx`** + **CSS 변수**(`--brand`, `--muted` 등) 위주

→ Tailwind는 사실상 globals import만 하고 있어 **의존성 대비 활용도 낮음**.  
  MUI만 쓸 거면 Tailwind 제거 검토, 둘 다 쓸 거면 README에 "MUI + CSS 변수 메인" 명시.

#### 3-6. `page.tsx`의 `"use client"`

홈 페이지는 `Typography`만 렌더. 상태/이벤트 없음.

→ `"use client"` 없이 **Server Component**로 두어도 됨 (불필요한 클라이언트 번들).

#### 3-7. `globals.css` 미사용 코드

- `@keyframes fadeUp` — 프로젝트 내 **어디에서도 사용 안 함**
- `@theme inline`, MUI override 등은 사용 중

#### 3-8. 디자인 토큰 이중 관리

- `globals.css`: `--brand`, `--brand-strong`, `--muted` …
- `MainLayout`, `SidebarItem`: `rgba(11, 91, 143, …)` 등 **하드코딩**

CSS 변수를 쓰는 곳과 sx에 직접 색을 넣는 곳이 섞여 있음. 유지보수 시 색 변경이 두 군데 필요.

#### 3-9. saga 에러 처리

```ts
} catch {
  yield put(fetchSidebarFailure("사이드바 로드 실패"));
}
```

모든 에러를 동일 메시지로 처리. 개발 중 원인 파악이 어려움 (console.error 정도는 있으면 디버깅 편함).

#### 3-10. `.env.local.example` 없음

`.env.local`은 gitignore 대상이라 repo에 없음. `.env.local.example`이 있으면 새 환경 세팅이 쉬움.

현재 필요한 값:

```
NEXT_PUBLIC_API_URL=http://localhost:8081
```

#### 3-11. 로그인 레이아웃 (미래)

`layout.tsx`가 **모든 페이지**에 `MainLayout`(사이드바 포함) 적용.

로그인 페이지 추가 시 `app/login/layout.tsx` 등 **별도 layout** 필요.  
(`showSidebar` prop은 이미 제거됨 — 방향은 맞음)

#### 3-12. MUI App Router 버전 표기

`providers.tsx`:

```ts
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
```

Next **16** + MUI **9** 조합. 현재 dev 서버에서 동작 중이면 문제 없으나, MUI 문서상 App Router 경로 버전과 맞는지 가끔 확인 필요.

---

## 4. 백엔드 연동 체크 (참고)

| 항목 | 상태 |
|------|------|
| API 경로 | 프론트 `/api/menus` ↔ 백엔드 `MenuController` 일치 |
| 포트 | `8081` (프론트 env + 백엔드 yml) — README만 8080으로 남아 있음 |
| CORS | `localhost:3000` 허용됨 |
| 8080 포트 | Oracle TNS Listener 점유 — Spring Boot를 8080에 두면 안 됨 |

---

## 5. 우선순위별 개선 제안

### 지금 당장 (문서)

1. `README.md` — 폴더 구조·포트 **8081**·`features/sidebar`로 수정
2. `AGENTS.md` — 백엔드 포트 **8081** 수정
3. `hospital-backend/README.md` — 포트 **8081** 수정
4. `.env.local.example` 추가

### 여유 있을 때 (코드)

5. 타입명 `SidebarItem` → `SidebarNode` 등으로 변경 (컴포넌트와 구분)
6. `page.tsx`에서 `"use client"` 제거
7. `globals.css`의 미사용 `fadeUp` 삭제 또는 실제 사용
8. 색상을 CSS 변수(`var(--brand)`)로 통일
9. Tailwind — 쓸 계획 없으면 의존성 제거, 쓸 계획 있으면 README에 명시

### 나중에 (기능 추가 시)

10. 로그인용 `app/login/layout.tsx` (MainLayout 없이)
11. saga 에러에 `console.error(error)` 추가
12. 메뉴 외 기능 추가 시 `features/환자/`, `components/환자/` 패턴 유지

---

## 6. 결론

**치명적인 코드 버그나 구조적 오류는 없음.**  
사이드바 로드 → Redux → UI 렌더 흐름은 일관되게 연결되어 있음.

가장 눈에 띄는 문제는 **README/AGENTS와 실제 코드·포트 불일치**와 **`SidebarItem` 타입/컴포넌트 이름 충돌** 정도.

초보 기준으로는 `components` = 화면, `features` = 데이터 규칙이 잡혀 있어 **앞으로 기능 추가하기에 무난한 상태**이며, 문서만 맞춰 두면 유지보수가 훨씬 수월해짐.
