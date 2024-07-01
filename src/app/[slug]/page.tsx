'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Generative from '@/genui/Generative';
import { HttpService } from '@/services';
import { useBrainStore } from '@/store/brain';
import { isRTL } from '@/utils';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function GptPage({ params }: { params: { slug: string } }) {
  const prompt_input_ref = useRef<HTMLTextAreaElement>(null);
  const { prompts, addPrompt, promptLoading, getResultAi, setChatKey, loadPrompts, firstPrompt, chatKey }: any =
    useBrainStore();

  const http = new HttpService();

  useEffect(() => {
    scrollToBottom();
  }, [promptLoading]);

  useEffect(() => {
    if (!params.slug) return;

    if (!chatKey) {
      setChatKey(params.slug);
      return;
    }

    http
      .get(`/chat/${params.slug}/`, {
        chat_id: params.slug
      })
      .then((res: any) => {
        loadPrompts(res.prompts);
        scrollToBottom();
        if (firstPrompt) {
          getResultAi(firstPrompt);
        }
      });
  }, [params.slug, firstPrompt, chatKey]);

  const newPrompt = () => {
    if (
      prompt_input_ref.current &&
      prompt_input_ref.current.value &&
      prompt_input_ref.current.value.trim() &&
      !promptLoading
    ) {
      const formData = new FormData();
      formData.append('chat_id', params.slug);
      formData.append('text', prompt_input_ref.current.value.trim());
      http.push('/prompt/send_prompt/', formData).then((res: any) => {
        addPrompt(res, true);
        getResultAi(res.id);
        scrollToBottom();
        if (prompt_input_ref.current) prompt_input_ref.current.value = '';
      });
    }
  };

  const chatContainer = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainer.current) {
        chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
      }
    }, 10);
  };

  useEffect(() => {
    if (!prompt_input_ref.current) return;
    const submitTextArea = (event: any) => {
      if (!prompt_input_ref.current) return;
      if (event.ctrlKey && event.key === 'Enter') {
        prompt_input_ref.current.value += '\n';
      } else if (event.key === 'Enter') {
        newPrompt();
        event.preventDefault();
      }
    };

    prompt_input_ref.current.addEventListener('keydown', submitTextArea);

    return () => {
      prompt_input_ref.current?.removeEventListener('keydown', submitTextArea);
    };
  }, []);

  return (
    <main className='h-screen flex bg-white w-5/6'>
      <div className='flex flex-col w-full my-auto h-screen items-center overflow-y-auto'>
        <div
          ref={chatContainer}
          className={`flex-1 items-center justify-center h-full transition-all relative overflow-y-auto min-h-72 w-full scroll-smooth`}
        >
          <div className='sticky top-0 bg-white z-10'>
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
              <div key={index} className='flex flex-col gap-4'>
                <div className='border rounded-lg w-1/2 bg-slate-50 ml-auto' dir={isRTL(prompt.text)}>
                  <p className='p-4'>{prompt.text}</p>
                </div>

                <Generative prompt={prompt} key={index}></Generative>
              </div>
            ))}
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
            disabled={promptLoading}
          />
          <Button
            size={'icon'}
            variant={'link'}
            className='absolute top-[50%] -translate-y-[50%] right-24 rounded-full transition-opacity opacity-75 hover:opacity-100'
            disabled={promptLoading}
          >
            <Image src={'/images/gpt/voice.svg'} alt='voice' width={21} height={21} />
          </Button>
          <Button
            size={'icon'}
            className={`absolute rounded-full z-50 disabled:opacity-100 ${
              (prompt_input_ref.current?.rows as number) > 1
                ? 'top-[50%] -translate-y-[50%] right-0 h-12 w-12'
                : 'top-[50%] -translate-y-[50%] right-8 h-16 w-16'
            }`}
            style={{
              background: 'linear-gradient(180deg, #0B94E4 0%, #343882 100%)'
            }}
            onClick={() => newPrompt()}
            disabled={promptLoading}
          >
            <Image src={'/images/gpt/send.svg'} alt='voice' width={24} height={24} />
          </Button>
        </div>
      </div>
    </main>
  );
}
