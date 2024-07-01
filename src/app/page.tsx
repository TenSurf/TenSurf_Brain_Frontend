'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { HttpService } from '@/services';
import { useBrainStore } from '@/store/brain';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const features = [
  {
    title: 'Examples',
    icon: '/images/gpt/light.svg',
    width: 33,
    height: 32,
    type: 'pnl',
    items: [
      `“Explain quantum computing in simple terms’’`,
      `“Got any creative ideas for a 10 year old’s birthday?’’`,
      `“How do I make an HTTP request in JavaScript?’’`
    ]
  },
  {
    title: 'Capabilities',
    icon: '/images/gpt/thunder.svg',
    width: 26,
    height: 26,
    type: '',
    items: [
      `QA with Financial Markets`,
      `Automate Trading Strategies`,
      `“How do I make an HTTP request in JavaScript?’’`
    ]
  },
  {
    title: 'Limitations',
    icon: '/images/gpt/warning.svg',
    width: 27,
    height: 27,
    type: '',
    items: [
      ` May occasionally generate incorrect information`,
      `May occasionally produce harmful instructions or biased`,
      `Limited knowledge of world and events after 2021`
    ]
  }
];

export default function Brain() {
  const prompt_input_ref = useRef<HTMLTextAreaElement>(null);
  const selectFeature = (item: string) => {
    if (!prompt_input_ref.current) return;
    prompt_input_ref.current.value = item;
  };
  const router = useRouter();
  const { setFirstPrompt, loadPrompts, setChatKey }: any = useBrainStore();
  const http = new HttpService();

  // useEffect(() => {
  //   setChatKey(null);
  // }, []);

  const newChat = () => {
    if (prompt_input_ref.current && prompt_input_ref.current.value && prompt_input_ref.current.value.trim()) {
      const formData = new FormData();
      formData.append('title', moment().format('MMMM DD, YYYY HH:mm:ss'));
      formData.append('text', prompt_input_ref.current.value.trim());
      http.push('/prompt/send_prompt/', formData).then((res: any) => {
        loadPrompts([res]);
        setFirstPrompt(res.id);
        router.push(`/${res.chat}`);
      });
    }
  };

  return (
    <main className='h-screen flex bg-white w-full'>
      <div className='flex flex-col w-full my-auto h-screen items-center overflow-y-auto'>
        <div
          className={`flex-1 items-center justify-center h-full transition-all relative overflow-y-auto min-h-72 w-full`}
        >
          <div className='sticky top-0 bg-white'>
            <Image
              src='/brain-logo.png'
              alt='tensurf'
              width={380}
              height={191}
              className='transition-all duration-500 mx-auto'
            />
          </div>
          <h1 className='text-[40px] text-black text-center'>Welcome to TenSurf Brain</h1>
        </div>
        <div className={`relative mb-8 container w-full lg:w-2/3`}>
          <Textarea
            // onChange={(e) => setChatMessage(e.target.value)}
            // disabled={chatLoading || is_play}
            className='bg-gpt text-gpt-foreground placeholder:text-gpt-foreground rounded-full ps-6 pe-28 min-h-[50px] border border-gpt py-4'
            required
            placeholder='search for anything'
            ref={prompt_input_ref}
            rows={1}
          />
          <Button
            size={'icon'}
            variant={'link'}
            className='absolute top-[50%] -translate-y-[50%] right-24 rounded-full transition-opacity opacity-75 hover:opacity-100'
          >
            <Image src={'/images/gpt/voice.svg'} alt='voice' width={21} height={21} />
          </Button>
          <Button
            size={'icon'}
            className={`absolute  rounded-full z-50 ${
              (prompt_input_ref.current?.rows as number) > 1
                ? 'top-[50%] -translate-y-[50%] right-0 h-12 w-12'
                : 'top-[50%] -translate-y-[50%] right-8 h-16 w-16'
            }`}
            style={{
              background: 'linear-gradient(180deg, #0B94E4 0%, #343882 100%)'
            }}
            onClick={() => newChat()}
          >
            <Image src={'/images/gpt/send.svg'} alt='voice' width={24} height={24} />
          </Button>
        </div>
        <div className='mb-8 container'>
          <div className='grid md:grid-cols-3 grid-cols-1 gap-12'>
            {features.map((feature: any, index: number) => {
              return (
                <div key={index} className='flex flex-col items-center gap-4'>
                  <div
                    className='w-[50px] h-[50px] rounded-full flex justify-center items-center'
                    style={{
                      background: 'linear-gradient(180deg, #1187D6 0%, #2F428D 100%)'
                    }}
                  >
                    <Image src={feature.icon} width={feature.width} height={feature.height} alt={feature.title} />
                  </div>
                  <h2 className='text-xl text-black'>{feature.title}</h2>
                  {feature.items.map((item: any, index: number) => {
                    return (
                      <Button
                        key={index}
                        className='bg-gpt w-full h-20 text-gpt-foreground rounded-[10px] justify-start'
                        onClick={() => selectFeature(item)}
                      >
                        <span className=' text-start line-clamp-2 text-wrap'>{item}</span>
                      </Button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
