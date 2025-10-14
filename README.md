## Lumina Backend (Turbo Monorepo)

### 모노레포 구조와 역할

```text
apps/
  api/         # REST API (NestJS)
  scheduler/   # 스케줄러/크론 작업 (NestJS)
  worker/      # 큐/워커 (NestJS / BullMQ)

packages/
  config/      # 공용 설정 유틸 ( env, etc ...)
  database/    # DB Repository Layer
  evm-contracts/ # EVM 관련 컨트랙트/설정
  redis/       # Redis 래퍼/유틸

docker-compose.yml  # 로컬 Postgres, Redis DB 서버 컨테이너 기동
env.example         # 환경변수 예시 (복사해서 사용)
```

### 요구 사항

- Node.js(v24.8.0), npm
- Docker, Docker Compose

### 로컬 개발 빠른 시작

1. 의존성 설치

```bash
npm install
```

2. 환경변수 파일 생성

```bash
cp env.example env.local
```

- `env.local`을 열어 값들을 로컬 환경에 맞게 설정하세요.
- 아래 값들은 `docker-compose.yml`과 일치해야 합니다.

```bash
# 공통
NODE_ENV=local
TZ=Asia/Seoul

# 포트/오리진(필요 시 원하는 포트로 교체)
PORT=8001
APP_ORIGIN=http://localhost:3000
API_ORIGIN=http://localhost:8001
ALLOWED_CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_TYPE=postgres
DATABASE_HOST= # DB Host
DATABASE_PORT= # DB Port
DATABASE_USER= # DB User
DATABASE_PASSWORD= # DB Password
DATABASE_NAME= # DB name
DATABASE_LOGGING=false

# Redis
REDIS_HOST= # Redis Host
REDIS_PORT= # Redis Port
REDIS_DB=0

# Scheduler env
## 임시 값 추후 변경
CRON_TVL=*/1 * * * * *
```

3. 인프라(데이터베이스/인메모리 캐시 DB) 기동

```bash
docker compose up -d
```

4. 앱 실행 (Turbo)

```bash
# 개발 모드(모든 앱 병렬 실행)
npm run dev

# 빌드 후 실행
npm run build && npm start
```

### 유용한 명령어

- 개발: `npm run dev`
- 빌드: `npm run build`
- 시작: `npm start`
- 린트: `npm run lint`
- 정리: `npm run clean`

### 참고 사항

- Postgres/Redis는 로컬 호스트에서 각각 `5432`, `6379` 포트를 사용합니다. 다른 프로세스와 포트가 충돌하면 docker-compose의 포트를 수정하거나 충돌 프로세스를 중지하세요.
- 각 앱(`apps/api`, `apps/scheduler`, `apps/worker`)은 공용 패키지(`packages/*`)를 사용합니다. 변경사항은 Turbo가 자동으로 감지하여 관련 워크스페이스만 재빌드/재시작합니다.
