import Image from "next/image";
import Link from "next/link";
import Footer from "../../components/Footer";
import ImageSlider from "../../components/ImageSlider";
import { FiMaximize2, FiUsers, FiMoon } from "react-icons/fi";

function makeImgs(folder: string, base: string, total: number): string[] {
  return [
    `/${folder}/${base}.jpg`,
    ...Array.from({ length: total - 1 }, (_, i) =>
      `/${folder}/${base}_${String(i + 1).padStart(2, "0")}.jpg`
    ),
  ];
}

const ROOM_TYPE_IMAGES: Record<string, string[]> = {
  스탠다드: makeImgs("객실(A-type)", "KakaoTalk_20260702_113958589", 19),
  프리미엄:  makeImgs("객실(B-type)", "KakaoTalk_20260702_114035977", 12),
  패밀리:   makeImgs("객실(C-type)", "KakaoTalk_20260702_114144440", 10),
};

// slug → 타입 이름 매핑 (rooms 목록 페이지에서 연결)
const SLUG_TO_TYPE: Record<string, string> = {
  standard: "스탠다드",
  premium:  "프리미엄",
  family:   "패밀리",
};

const standardRoomExtras = {
  extraGuestFee:
    "1인 30,000원 (성인, 아동, 유아) · 1박 기준 · 영유아 인원수 포함 · 최대인원 초과 시 펜션 문의",
  pool: {
    size: "2.2M × 6M · 수심 1.2M (수심조절 불가)",
    heatedFee: "1박당 50,000원 (현장결제)",
    heatedInfo: "미온수 온도 28~30도 · 사용시간 15:00~21:00",
    note: "객실 이용 시 미온수 이용 필수 (냉수 이용 불가)",
  },
  bbq: "실내 바베큐 가능 (안방그릴) · 30,000원",
  equipment: [
    "TV",
    "더블사이즈 침대",
    "냉장고",
    "정수기",
    "시스템에어컨",
    "소파",
    "전기밥솥",
    "전자레인지",
    "식기류 일체",
    "안방그릴",
    "WiFi",
    "수건 제공",
    "드라이기",
    "튜브",
    "구명조끼",
  ],
  schedule: {
    weekday: "일요일~목요일 (금요일·공휴일 전날은 요금 별도 표시)",
    weekend: "토요일, 공휴일 전날",
  },
};

const roomMeta: Record<
  string,
  {
    name: string;
    type: string;
    size: string;
    guests: string;
    beds: string;
    features: string[];
    imageCount: number;
    extraGuestFee?: string;
    pool?: {
      size: string;
      heatedFee: string;
      heatedInfo: string;
      note: string;
    };
    bbq?: string;
    equipment?: string[];
    schedule?: { weekday: string; weekend: string };
  }
> = {
  // ── 타입 슬러그 (rooms 목록에서 연결) ──────────────────────────────
  standard: {
    name: "스탠다드",
    type: "스탠다드",
    size: "37평형 (약 122m²)",
    guests: "기준 2인 / 최대 6인",
    beds: "더블침대 1개",
    features: ["실내 온수수영장", "스파", "온열사우나", "주방", "거실", "화장실 2개"],
    imageCount: 19,
    ...standardRoomExtras,
  },
  premium: {
    name: "프리미엄",
    type: "프리미엄",
    size: "37평형 (약 122m²)",
    guests: "기준 2인 / 최대 8인",
    beds: "더블침대 1개",
    features: ["실내 온수수영장", "스파", "온열사우나", "주방", "거실", "화장실 2개"],
    imageCount: 12,
    ...standardRoomExtras,
  },
  family: {
    name: "패밀리",
    type: "패밀리",
    size: "55평형 (약 182m²)",
    guests: "기준 2인 / 최대 15인",
    beds: "침실1: 더블1 · 싱글1 / 침실2: 더블1",
    features: ["실내 온수수영장", "스파", "온열사우나", "주방", "거실", "화장실 2개"],
    imageCount: 10,
    extraGuestFee: standardRoomExtras.extraGuestFee,
    equipment: standardRoomExtras.equipment,
    schedule: standardRoomExtras.schedule,
  },
  // ── 개별 객실 ──────────────────────────────────────────────────────
  "4588795": {
    name: "스탠다드 201",
    type: "스탠다드",
    size: "37평형 (122m²)",
    guests: "기준 2인 / 최대 6인",
    beds: "더블침대 1개",
    features: ["실내 온수수영장", "스파", "습식 사우나", "주방", "거실", "화장실 2개"],
    imageCount: 15,
    ...standardRoomExtras,
  },
  "4588796": {
    name: "스탠다드 301",
    type: "스탠다드",
    size: "37평형 (122m²)",
    guests: "기준 2인 / 최대 6인",
    beds: "더블침대 1개",
    features: ["실내 온수수영장", "스파", "습식 사우나", "주방", "거실", "화장실 2개"],
    imageCount: 15,
    ...standardRoomExtras,
  },
  "4588797": {
    name: "스탠다드 401",
    type: "스탠다드",
    size: "37평형 (122m²)",
    guests: "기준 2인 / 최대 6인",
    beds: "더블침대 1개",
    features: ["실내 온수수영장", "스파", "습식 사우나", "주방", "거실", "화장실 2개"],
    imageCount: 15,
    ...standardRoomExtras,
  },
  "4588798": {
    name: "프리미엄 201",
    type: "프리미엄",
    size: "37평형 (122m²)",
    guests: "기준 2인 / 최대 8인",
    beds: "더블침대 1개",
    features: ["실내 온수수영장", "스파", "습식 사우나", "주방", "거실", "화장실 2개"],
    imageCount: 15,
    ...standardRoomExtras,
  },
  "4588799": {
    name: "프리미엄 202",
    type: "프리미엄",
    size: "37평형 (약 122m²)",
    guests: "기준 2인 / 최대 8인",
    beds: "더블침대 1개",
    features: ["실내 온수수영장", "스파", "습식 사우나", "주방", "거실", "화장실 2개"],
    imageCount: 14,
    ...standardRoomExtras,
  },
  "4588800": {
    name: "프리미엄 301",
    type: "프리미엄",
    size: "37평형 (122m²)",
    guests: "기준 2인 / 최대 8인",
    beds: "더블침대 1개",
    features: ["실내 온수수영장", "스파", "습식 사우나", "주방", "거실", "화장실 2개"],
    imageCount: 15,
    ...standardRoomExtras,
  },
  "4588801": {
    name: "프리미엄 302",
    type: "프리미엄",
    size: "37평형 (122m²)",
    guests: "기준 2인 / 최대 8인",
    beds: "더블침대 1개",
    features: ["실내 온수수영장", "스파", "습식 사우나", "주방", "거실", "화장실 2개"],
    imageCount: 15,
    ...standardRoomExtras,
  },
  "4588802": {
    name: "프리미엄 401",
    type: "프리미엄",
    size: "37평형 (122m²)",
    guests: "기준 2인 / 최대 8인",
    beds: "더블침대 1개",
    features: ["실내 온수수영장", "스파", "습식 사우나", "주방", "거실", "화장실 2개"],
    imageCount: 15,
    ...standardRoomExtras,
  },
  "4588803": {
    name: "프리미엄 402",
    type: "프리미엄",
    size: "37평형 (122m²)",
    guests: "기준 2인 / 최대 8인",
    beds: "더블침대 1개",
    features: ["실내 온수수영장", "스파", "습식 사우나", "주방", "거실", "화장실 2개"],
    imageCount: 14,
    ...standardRoomExtras,
  },
  "4588804": {
    name: "패밀리 201",
    type: "패밀리",
    size: "55평형 (182m²)",
    guests: "기준 2인 / 최대 15인",
    beds: "침실1: 더블1 · 싱글1 / 침실2: 더블1",
    features: ["실내 온수수영장", "스파", "습식 사우나", "주방", "거실", "화장실 2개"],
    imageCount: 17,
    extraGuestFee: standardRoomExtras.extraGuestFee,
    equipment: standardRoomExtras.equipment,
    schedule: standardRoomExtras.schedule,
  },
  "4588805": {
    name: "패밀리 301",
    type: "패밀리",
    size: "55평형 (182m²)",
    guests: "기준 2인 / 최대 15인",
    beds: "침실1: 더블1 · 싱글1 / 침실2: 더블1",
    features: ["실내 온수수영장", "스파", "습식 사우나", "주방", "거실", "화장실 2개"],
    imageCount: 17,
    extraGuestFee: standardRoomExtras.extraGuestFee,
    equipment: standardRoomExtras.equipment,
    schedule: standardRoomExtras.schedule,
  },
};

export default async function RoomDetailPage(props: PageProps<"/rooms/[id]">) {
  const { id } = await props.params;
  const room = roomMeta[id];

  if (!room) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-4">객실을 찾을 수 없습니다</p>
          <Link href="/rooms" className="text-sm font-semibold text-[#2A8EA2]">
            ← 객실 목록으로
          </Link>
        </div>
      </main>
    );
  }

  const images = ROOM_TYPE_IMAGES[room.type] ?? [];

  return (
    <main>
      {/* Full-screen slider */}
      <section className="relative" style={{ height: "75vh" }}>
        <ImageSlider images={images} alt={room.name} className="h-full" />
        <div className="absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-black/50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-10 text-white pointer-events-none">
          <div className="max-w-7xl mx-auto">
            <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold mb-3 text-white/90">
              {room.type}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {room.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Room Info */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16">
          {/* Details */}
          <div className="md:col-span-2">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="rounded-2xl bg-[#FAFAF9] px-6 py-7 flex flex-col items-start gap-3">
                <FiMaximize2 size={16} className="text-[#2A8EA2]" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">면적</p>
                  <p className="text-sm font-semibold text-gray-800">{room.size}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-[#FAFAF9] px-6 py-7 flex flex-col items-start gap-3">
                <FiUsers size={16} className="text-[#2A8EA2]" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">인원</p>
                  <p className="text-sm font-semibold text-gray-800">{room.guests}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-[#FAFAF9] px-6 py-7 flex flex-col items-start gap-3">
                <FiMoon size={16} className="text-[#2A8EA2]" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">침대</p>
                  <p className="text-sm font-semibold text-gray-800">{room.beds}</p>
                </div>
              </div>
            </div>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-5">
              Facilities
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {room.features.map((f) => (
                <div
                  key={f}
                  className="rounded-2xl bg-[#FAFAF9] px-5 py-4 text-sm text-gray-700 font-medium flex items-center gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2A8EA2] shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            {(room.pool || room.bbq || room.equipment || room.extraGuestFee || room.schedule) && (
              <div className="mt-12 space-y-8">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  이용안내
                </p>

                {room.extraGuestFee && (
                  <div>
                    <p className="text-sm text-gray-800 font-semibold mb-1.5">인원추가요금</p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {room.extraGuestFee}
                    </p>
                  </div>
                )}

                {room.pool && (
                  <div>
                    <p className="text-sm text-gray-800 font-semibold mb-1.5">개별수영장</p>
                    <ul className="text-sm text-gray-500 leading-relaxed space-y-0.5">
                      <li>개별 수영장 크기: {room.pool.size}</li>
                      <li>미온수 이용요금: {room.pool.heatedFee}</li>
                      <li>{room.pool.heatedInfo}</li>
                      <li>{room.pool.note}</li>
                    </ul>
                  </div>
                )}

                {room.bbq && (
                  <div>
                    <p className="text-sm text-gray-800 font-semibold mb-1.5">실내 바베큐</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{room.bbq}</p>
                  </div>
                )}

                {room.equipment && (
                  <div>
                    <p className="text-sm text-gray-800 font-semibold mb-1.5">구비시설</p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {room.equipment.join(", ")}
                    </p>
                  </div>
                )}

                {room.schedule && (
                  <div>
                    <p className="text-sm text-gray-800 font-semibold mb-1.5">기간안내</p>
                    <ul className="text-sm text-gray-500 leading-relaxed space-y-0.5">
                      <li>주중: {room.schedule.weekday}</li>
                      <li>주말: {room.schedule.weekend}</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="rounded-3xl bg-[#FAFAF9] p-8 sticky top-24 shadow-sm">
              <p className="text-xs font-semibold text-[#2A8EA2] uppercase tracking-wide mb-1">
                {room.type}
              </p>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{room.name}</h3>
              <p className="text-sm text-gray-500 mb-7">
                {room.size} &nbsp;·&nbsp; {room.guests}
              </p>

              <div className="border-t border-gray-200 pt-5 mb-7 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">체크인</span>
                  <span className="text-gray-800 font-semibold">15:00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">체크아웃</span>
                  <span className="text-gray-800 font-semibold">11:00</span>
                </div>
              </div>

              <Link
                href="/booking"
                className="btn-pop block w-full text-center py-3.5 rounded-full bg-[#2A8EA2] text-white text-sm font-semibold shadow-sm hover:shadow-lg transition-shadow mb-3"
              >
                실시간예약
              </Link>
              <Link
                href="/reservation"
                className="btn-pop block w-full text-center py-3 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-semibold hover:border-gray-400 transition-colors"
              >
                예약안내
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Thumbnail grid */}
      <section className="pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-5">
            Photos
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((src, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl aspect-square"
              >
                <Image
                  src={src}
                  alt={`${room.name} ${i + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 pb-10">
        <Link
          href="/rooms"
          className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← 객실 목록으로
        </Link>
      </div>

      <Footer />
    </main>
  );
}
