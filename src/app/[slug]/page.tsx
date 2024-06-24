'use client';

import { HorizontalLoading } from '@/components/animate/HorizontalLoading';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { HttpService } from '@/services';
import { useBrainStore } from '@/store/brain';
import { isRTL } from '@/utils';
import { Bookmark, CheckCheckIcon, CopyIcon, ThumbsDownIcon, Volume2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function GptPage({ params }: { params: { slug: string } }) {
  const prompt_input_ref = useRef<HTMLTextAreaElement>(null);
  const {
    prompts,
    addPrompt,
    promptLoading,
    setPromptLoading,
    setChatKey,
    loadPrompts,
    toggleBookmark,
    dislikePrompt
  }: any = useBrainStore();
  const [copy, setCopy] = useState<number>(0);

  const http = new HttpService();

  const toggle_copy = (item: any) => {
    setCopy(item.id);
    navigator.clipboard.writeText(item.text);
    setTimeout(() => {
      setCopy(0);
    }, 3000);
  };

  const toggle_dislike = (id: number) => {
    http.push('/prompt/dislike_prompt/', {
      id: id
    });
    dislikePrompt(id);
  };

  useEffect(() => {
    if (!params.slug) return;
    setChatKey(params.slug);

    http
      .push('/prompt/all_message/', {
        key: params.slug
      })
      .then((res: any) => {
        loadPrompts(res);
      });
  }, [params.slug, loadPrompts, setChatKey]);

  const newPrompt = () => {
    if (prompt_input_ref.current && prompt_input_ref.current.value && prompt_input_ref.current.value.trim()) {
      // scrollToBottom();
      // setUploadLoading(true);
      const formData = new FormData();
      formData.append('key', params.slug);
      formData.append('text', prompt_input_ref.current.value.trim());
      http.push('/prompt/send_prompt/', formData).then((res: any) => {
        addPrompt(res);
        setPromptLoading(true);
      });
    }
  };

  const changeBookmark = (prompt: any) => {
    toggleBookmark(prompt.id);
    http
      .push('/prompt/bookmark_prompt/', {
        id: prompt.id
      })
      .catch(() => {
        toggleBookmark(prompt.id);
      });
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
              width={190}
              height={96}
              className='transition-all duration-500 mx-auto'
            />
          </div>
          <div className='flex flex-col w-full gap-4 py-4 container md:px-12 lg:px-36'>
            {prompts.map((prompt: any, index: number) => (
              <div key={index} className='flex flex-col gap-2'>
                <div
                  className={`border rounded-lg ${prompt.role === 1 ? 'w-1/2 bg-slate-50 ml-auto' : 'w-5/6'}`}
                  dir={isRTL(prompt.text)}
                >
                  <p className='p-4'>{prompt.text}</p>
                </div>
                {prompt.role === 0 && (
                  <div className='flex gap-1'>
                    <Button
                      variant={'ghost'}
                      size={'icon'}
                      className='w-[30px] h-[30px] relative'
                      onClick={() => toggle_copy(prompt)}
                    >
                      <CheckCheckIcon
                        className={`w-[18px] h-[18px] absolute transition-all duration-200 ${
                          copy === prompt.id ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                      <CopyIcon
                        className={`w-[18px] h-[18px] absolute transition-all duration-200 ${
                          copy === prompt.id ? 'opacity-0' : 'opacity-100'
                        }`}
                      />
                    </Button>
                    <Button
                      variant={'ghost'}
                      size={'icon'}
                      className='w-[30px] h-[30px]'
                      onClick={() => !prompt.dislike && toggle_dislike(prompt.id)}
                    >
                      <ThumbsDownIcon className={`w-[18px] h-[18px] ${prompt.dislike && 'text-destructive'}`} />
                    </Button>
                    {/* <Button
                      variant={'ghost'}
                      size={'icon'}
                      className='w-[30px] h-[30px]'
                      onClick={() => changeBookmark(prompt)}
                    >
                      <Bookmark className={`w-[18px] h-[18px] ${prompt.bookmark && 'fill-amber-500 text-amber-500'}`} />
                    </Button> */}
                    {/* <Button variant={'ghost'} size={'icon'} className='w-[30px] h-[30px]'>
                      <Volume2 className='w-[18px] h-[18px]' />
                    </Button> */}
                  </div>
                )}
              </div>
            ))}
            {promptLoading && (
              <div className='w-full flex justify-start my-2'>
                <HorizontalLoading />
              </div>
            )}
          </div>
        </div>
        <div className={`relative mb-8 container w-full lg:w-2/3`}>
          <Textarea
            // onChange={(e) => setChatMessage(e.target.value)}
            // disabled={chatLoading || is_play}
            className='bg-gpt text-gpt-foreground placeholder:text-gpt-foreground rounded-full ps-6 pe-28 min-h-[50px] border border-gpt py-4'
            required
            // placeholder='search for anything'
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
            onClick={() => newPrompt()}
          >
            <Image src={'/images/gpt/send.svg'} alt='voice' width={24} height={24} />
          </Button>
        </div>
      </div>
    </main>
  );
}
