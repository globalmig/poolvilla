import Image from "next/image";
import Link from "next/link";
import Footer from "../../components/Footer";
import ImageSlider from "../../components/ImageSlider";
import { FiMoon, FiMaximize2, FiUsers } from "react-icons/fi";

function makeImgs(folder: string, base: string, total: number): string[] {
  return [
    `/${folder}/${base}.jpg`,
    ...Array.from({ length: total - 1 }, (_, i) =>
      `/${folder}/${base}_${String(i + 1).padStart(2, "0")}.jpg`
    ),
  ];
}

const ROOM_TYPE_IMAGES: Record<string, string[]> = {
  A타입: makeImgs("객실(A-type)", "KakaoTalk_20260702_113958589", 19),
  B타입:  makeImgs("객실(B-type)", "KakaoTalk_20260702_114035977", 12),
  C타입:   makeImgs("객실(C-type)", "KakaoTalk_20260702_114144440", 10),
};

const standardRoomExtras = {
  extraGuestFee:
    "1인 30,000원 (성인, 아동, 유아) · 1박 기준 · 영유아 인원수 포함 · 기준 인원 초과 시 펜션 문의",
  pool: {
    size: "2.2M × 6M · 수심 1.2M (수심조절 불가)",
    heatedFee: "1박당 50,000원 (현장결제)",
    heatedInfo: "미온수 온도 28~30도 · 사용시간 15:00~21:00",
    note: "객실 이용 시 미온수 이용 필수 (냉수 이용 불가)",
  },
  bbq: "실내 바베큐 가능 (안방 양면그릴) · 20,000원",
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
    "안방 양면그릴",
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

// 슬러그(=예약 시스템의 RoomType 코드 a/b/c)별 객실 정보
const roomMeta: Record<
  string,
  {
    name: string;
    type: string;
    size: string;
    maxGuests: number;
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
  a: {
    name: "프리미엄",
    type: "A타입",
    size: "37평형",
    maxGuests: 8,
    beds: "더블침대 1개",
    features: ["실내 온수수영장", "스파", "온열사우나", "주방", "거실", "화장실 2개"],
    imageCount: 19,
    ...standardRoomExtras,
  },
  b: {
    name: "프리미엄",
    type: "B타입",
    size: "37평형",
    maxGuests: 8,
    beds: "더블침대 1개",
    features: ["실내 온수수영장", "스파", "온열사우나", "주방", "거실", "화장실 2개"],
    imageCount: 12,
    ...standardRoomExtras,
  },
  c: {
    name: "스탠다드",
    type: "C타입",
    size: "37평형",
    maxGuests: 6,
    beds: "더블침대 1개",
    features: ["실내 온수수영장", "스파", "온열사우나", "주방", "거실", "화장실 2개"],
    imageCount: 10,
    ...standardRoomExtras,
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              <div className="rounded-2xl bg-[#FAFAF9] px-6 py-7 flex flex-col items-start gap-3">
                <FiMaximize2 size={16} className="text-[#2A8EA2]" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">평형</p>
                  <p className="text-sm font-semibold text-gray-800">{room.size}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-[#FAFAF9] px-6 py-7 flex flex-col items-start gap-3">
                <FiUsers size={16} className="text-[#2A8EA2]" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">기준 인원</p>
                  <p className="text-sm font-semibold text-gray-800">최대 {room.maxGuests}인</p>
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
              <h3 className="text-lg font-bold text-gray-900 mb-7">{room.name}</h3>

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
          <div className="fill-last-row-2-3-4-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
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
