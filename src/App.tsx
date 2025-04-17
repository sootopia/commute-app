import Header from './components/Header';
import Wrapper from './components/Wrapper';
import { useState, useEffect } from 'react';
import BusInfo from './components/BusInfo';

type Mode = 'work' | 'home';

type BusStop = {
  id: string;
  name: string;
  busRoutes: {
    routeName: string;
    direction: string;
    type: string;
    bgColor: string;
    textColor: string;
  }[];
};

type BusArrivalInfo = {
  routeName: string;
  predictTime1: string;
  predictTime2: string;
};

type BusResponse = {
  response: {
    msgBody: {
      busArrivalList: Array<{
        routeName: string;
        predictTime1: string;
        predictTime2: string;
      }>;
    };
  };
};

const busStops: BusStop[] = [
  {
    id: '233000150',
    name: '반도유보라.센트럴푸르지오',
    busRoutes: [
      {
        routeName: '18',
        direction: '(시범호반써밋.롯데캐슬 방향)',
        type: '일반',
        bgColor: '#0b7240',
        textColor: 'white',
      },
      {
        routeName: 'H15',
        direction: '(시범호반써밋.롯데캐슬 방향)',
        type: '마을',
        bgColor: '#efe600',
        textColor: '#585858',
      },
    ],
  },
];

const App = () => {
  const [mode, setMode] = useState<Mode>('work');
  const [busArrivalInfo, setBusArrivalInfo] = useState<Record<string, BusArrivalInfo[]>>({});

  const fetchBusArrivalInfo = async (stationId: string) => {
    try {
      const response = await fetch(
        `https://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalListv2?serviceKey=${
          import.meta.env.VITE_API_SERVICE_KEY
        }&stationId=${stationId}&format=json`,
      );
      const data: BusResponse = await response.json();

      const busList = data.response.msgBody.busArrivalList;
      const busStop = busStops.find((stop) => stop.id === stationId);

      if (!busStop) return;

      const filteredBuses = busList.filter((bus) =>
        busStop.busRoutes.some((route) => route.routeName === bus.routeName),
      );

      setBusArrivalInfo((prev) => ({
        ...prev,
        [stationId]: filteredBuses.map((bus) => ({
          routeName: bus.routeName,
          predictTime1: bus.predictTime1 || '',
          predictTime2: bus.predictTime2 || '',
        })),
      }));
    } catch (error) {
      console.error(`정류장 ${stationId}의 버스 도착 정보를 가져오는데 실패했습니다:`, error);
    }
  };

  useEffect(() => {
    busStops.forEach((stop) => {
      fetchBusArrivalInfo(stop.id);
    });

    const interval = setInterval(() => {
      busStops.forEach((stop) => {
        fetchBusArrivalInfo(stop.id);
      });
    }, 10000); // 10초마다 갱신

    return () => clearInterval(interval);
  }, []);

  const handleMode = (mode: Mode) => {
    setMode(mode);
  };

  const activeClass = 'text-slate-800 font-bold h-12 rounded-lg bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]';
  const normalClass = 'text-slate-500 font-medium h-12 rounded-lg';

  const getBusTime = (stationId: string, routeName: string) => {
    const stationBuses = busArrivalInfo[stationId];
    if (!stationBuses) return '정보 없음';

    const bus = stationBuses.find((info) => info.routeName === routeName);
    if (!bus) return '정보 없음';

    const time1 = bus.predictTime1 ? `${bus.predictTime1}분` : '';
    const time2 = bus.predictTime2 ? `, ${bus.predictTime2}분` : '';

    return time1 + time2 || '정보 없음';
  };

  return (
    <>
      <Wrapper>
        <Header />
        <main className="pt-20">
          {/* 출퇴근 탭 */}
          <div className="grid grid-cols-2 mb-12 gap-2 p-2 rounded-lg bg-slate-50">
            <button className={mode === 'work' ? activeClass : normalClass} onClick={() => handleMode('work')}>
              출근
            </button>
            <button className={mode === 'home' ? activeClass : normalClass} onClick={() => handleMode('home')}>
              퇴근
            </button>
          </div>
          {/* 출퇴근 탭 */}

          {/* 버스정류장 목록 */}
          {busStops.map((stop) => (
            <div key={stop.id} className="rounded-xl overflow-hidden mb-4">
              <div className="py-3 px-4 bg-indigo-500">
                <h2 className="text-white font-semibold">{stop.name}</h2>
              </div>
              <div className="p-4 border border-solid border-t-0 border-slate-200 rounded-b-xl">
                <div className="flex flex-col gap-2">
                  {stop.busRoutes.map((route) => (
                    <BusInfo
                      key={`${stop.id}-${route.routeName}`}
                      name={route.routeName}
                      direction={route.direction}
                      type={route.type}
                      time={getBusTime(stop.id, route.routeName)}
                      bgColor={route.bgColor}
                      textColor={route.textColor}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
          {/* 버스정류장 목록 */}
        </main>
      </Wrapper>
    </>
  );
};

export default App;
