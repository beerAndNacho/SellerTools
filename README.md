# SellerTools 100

온라인 판매자와 소상공인이 판매 전 계산부터 배송 후 고객관리까지 브라우저에서 처리할 수 있는 업무 도구 100개입니다.

## 공개 구조

- 포털: `https://beerandnacho.github.io/SellerTools/`
- 개별 도구: `https://beerandnacho.github.io/SellerTools/tools/<slug>/`
- 전체 목록: [`docs/SELLER-TOOLS-100.md`](docs/SELLER-TOOLS-100.md)

## 업무 영역

1. 가격·마진
2. 광고·프로모션
3. 상품등록
4. 상품데이터
5. 이미지·콘텐츠
6. 재고·발주
7. 주문·배송
8. 교환·CS
9. 리뷰·고객
10. 매출·운영

## 특징

- 도구별 독립 URL 100개
- 계산·검사·CSV 변환·문서 생성·이미지 처리
- 검색·카테고리·최근 사용·즐겨찾기 포털
- 입력값과 이미지를 외부 API로 전송하지 않는 브라우저 로컬 처리
- 판매 채널 수수료는 고정값 대신 사용자가 실제 적용 요율을 입력
- 도구별 고유 title·description·canonical·구조화 데이터
- sitemap.xml·robots.txt
- 100개 카탈로그와 비이미지 도구 예시 실행을 검사하는 CI

## 소스 구조

```text
src/catalog/       10개 업무 영역별 도구 정의
src/operations/    가격·상품·물류·고객/분석 연산 모듈
src/engine.js      개별 도구 UI·결과·Canvas 이미지 처리
src/portal.js      검색·카테고리·최근 사용 포털
src/styles.css     반응형 편집형 UI
scripts/check.mjs  100개 도구·연산·예시 실행 검증
scripts/build.mjs  포털과 독립 URL 100개 정적 빌드
```

## 검증과 빌드

```bash
npm run check
npm run build
```

빌드 결과는 `dist/`에 생성됩니다.
