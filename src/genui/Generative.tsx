import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { isRTL } from '@/utils';
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  CheckCheckIcon,
  CircleStopIcon,
  CopyIcon,
  LoaderIcon,
  RefreshCcwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Volume2Icon
} from 'lucide-react';
import PnlChart from './PnlChart';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { useBrainStore } from '@/store/brain';
import { HttpService } from '@/services';
import { HorizontalLoading } from '@/components/animate/HorizontalLoading';
import BrainIcon from '@/icons/BrainIcon';

const pnl_rows = [
  { title: 'Trades#', key: 'Trades#' },
  { title: 'Win', key: 'Win' },
  { title: 'PF', key: 'PF' },
  { title: 'Pos - Neg', key: 'Pos - Neg' },
  { title: 'Cum PnL', key: 'Cum PnL' },
  { title: 'PROM', key: 'PROM' },
  { title: 'Max DD (%)', key: 'Max DD (%)' },
  { title: 'Max DD ($)', key: 'Max DD ($)' }
];

function Generative(props: { prompt: any }) {
  const regenerations = props.prompt.regenerations;
  const [copy, setCopy] = useState<number>(0);
  const [current, setCurrent] = useState(0);
  const { getResultAi, likePrompt }: any = useBrainStore();
  const [playerLoading, setPlayerLoading] = useState<boolean>(false);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const player = useRef<HTMLAudioElement>(null);

  const http = new HttpService();

  const toggle_copy = (item: any) => {
    setCopy(item.id);
    navigator.clipboard.writeText(item.text);
    setTimeout(() => {
      setCopy(0);
    }, 3000);
  };

  const regenerate = (regeneration: any) => {
    getResultAi(regeneration.parent_prompt);
    setCurrent(() => regenerations.length);
  };

  const changeLike = (id: number, flag: boolean) => {
    http.push('/prompt/change_like_prompt/', {
      id: id,
      flag: flag
    });
    likePrompt(id, flag);
  };

  const speech = (text: any) => {
    setPlayerLoading(true);
    http
      .push(
        '/prompt/text_to_speech/',
        {
          text: text
        },
        {},
        false,
        true
      )
      .then((blob: any) => {
        const url = URL.createObjectURL(blob);
        if (player.current) {
          player.current.src = url;
          player.current.play();
          setIsPlay(true);
        }
      })
      .finally(() => {
        setPlayerLoading(false);
      });
  };

  const stopPlayer = () => {
    if (player.current) {
      player.current.pause();
      setIsPlay(false);
    }
  };

  useEffect(() => {
    setCurrent(regenerations.length - 1);
  }, [regenerations.length]);

  return (
    <div className='w-5/6 flex gap-2'>
      <div>
        <BrainIcon className='w-8 h-8 border p-1 rounded-full text-primary' />
      </div>
      <div>
        {regenerations.map((regeneration: any, index: number) => (
          <div className={`flex flex-col gap-2 ${index === current ? '' : 'hidden'}`} key={index}>
            <div className='border rounded-lg' dir={isRTL(regeneration.text)}>
              <p className='p-4'>{regeneration.text}</p>
            </div>
            <div className='flex flex-col gap-4'>
              {regeneration.type === 'pnl' && (
                <div className='flex flex-col gap-4 w-full'>
                  <Table key={regeneration.id}>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        {pnl_rows.map((pnl: any, idx: number) => (
                          <TableHead key={idx}>{pnl.title}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { key: 'result', value: 'Result' },
                        { key: 'result_long', value: 'Long' },
                        { key: 'result_short', value: 'Short' }
                      ].map((pnl_key: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{pnl_key.value}</TableCell>
                          {pnl_rows.map((pnl: any, idx: number) => (
                            <TableCell key={idx} className='truncate'>
                              {regeneration.extra[pnl_key.key][pnl.key]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <PnlChart data={regeneration.extra.pnl} id={regeneration.id} />
                </div>
              )}
            </div>
          </div>
        ))}
        {!!regenerations.length && !props.prompt.loading && (
          <div className='flex gap-1'>
            <Button
              variant={'ghost'}
              size={'icon'}
              className='w-[30px] h-[30px] relative'
              onClick={() => toggle_copy(regenerations[current])}
            >
              <CheckCheckIcon
                className={`w-[18px] h-[18px] absolute transition-all duration-200 ${
                  copy === regenerations[current]?.id ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <CopyIcon
                className={`w-[18px] h-[18px] absolute transition-all duration-200 ${
                  copy === regenerations[current]?.id ? 'opacity-0' : 'opacity-100'
                }`}
              />
            </Button>
            <Button variant={'ghost'} size={'icon'} className='w-[30px] h-[30px]'>
              <RefreshCcwIcon className='w-[18px] h-[18px]' onClick={() => regenerate(regenerations[current])} />
            </Button>
            <Button
              variant={'ghost'}
              size={'icon'}
              className='w-[30px] h-[30px]'
              onClick={() => !regenerations[current]?.like && changeLike(regenerations[current]?.id, true)}
            >
              <ThumbsUpIcon className={`w-[18px] h-[18px] ${regenerations[current]?.like && 'text-primary'}`} />
            </Button>
            <Button
              variant={'ghost'}
              size={'icon'}
              className='w-[30px] h-[30px]'
              onClick={() => regenerations[current]?.like !== false && changeLike(regenerations[current]?.id, false)}
            >
              <ThumbsDownIcon
                className={`w-[18px] h-[18px] ${regenerations[current]?.like === false && 'text-destructive'}`}
              />
            </Button>
            <Button
              variant={'ghost'}
              size={'icon'}
              className='w-[30px] h-[30px] relative transition-opacity'
              onClick={() => {
                !playerLoading && !isPlay && speech(regenerations[current]?.text);
                isPlay && stopPlayer();
              }}
            >
              <Volume2Icon className={`w-[18px] h-[18px] absolute ${(playerLoading || isPlay) && 'opacity-0'}`} />
              <LoaderIcon className={`w-[18px] h-[18px] animate-spin absolute ${!playerLoading && 'opacity-0'}`} />
              <CircleStopIcon className={`w-[18px] h-[18px] absolute top-1.5 left-1.5 ${!isPlay && 'opacity-0'}`} />
            </Button>

            {regenerations.length > 1 && (
              <div className='py-2 text-center text-sm text-muted-foreground ml-auto flex items-center'>
                <Button
                  variant={'ghost'}
                  size={'icon'}
                  className='w-[30px] h-[30px]'
                  disabled={current === 0}
                  onClick={() => setCurrent(prev => prev - 1)}
                >
                  <ArrowLeftCircleIcon className='w-[18px] h-[18px]' />
                </Button>
                {current + 1} of {regenerations.length}
                <Button
                  variant={'ghost'}
                  size={'icon'}
                  className='w-[30px] h-[30px]'
                  disabled={current === regenerations.length - 1}
                  onClick={() => setCurrent(prev => prev + 1)}
                >
                  <ArrowRightCircleIcon className='w-[18px] h-[18px]' />
                </Button>
              </div>
            )}
          </div>
        )}
        {props.prompt.loading && (
          <div className='w-full flex justify-start my-3'>
            <HorizontalLoading />
          </div>
        )}
      </div>
      <audio ref={player} onEnded={stopPlayer}></audio>
    </div>
  );
}

export default Generative;
