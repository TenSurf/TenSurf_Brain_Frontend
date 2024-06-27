'use client';

import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBrainStore } from '@/store/brain';
import HomeIcon from '@/icons/brain/Home';
import BookmarkIcon from '@/icons/brain/Bookmark';
import ChatsIcon from '@/icons/brain/Chats';
import TipsIcon from '@/icons/brain/Tips';
import FaqIcon from '@/icons/brain/Faq';
import UpgradeIcon from '@/icons/brain/Upgrade';
import LogoutIcon from '@/icons/brain/Logout';
import { HttpService } from '@/services';
import Cookies from 'js-cookie';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ArrowLeftCircleIcon,
  EllipsisVerticalIcon,
  UserRoundIcon,
  BookmarkIcon as BookmarkIconLucide,
  TrashIcon,
  Loader2Icon
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
});

export default function BrainLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menu_select, setMenuSelect] = useState<string>('Home');
  const router = useRouter();
  const { chats, loadChats, chatKey, setChatKey, toggleBookmark, dropChat, userData, updateUserData }: any =
    useBrainStore();
  const [openDelete, setOpenDelete] = useState<boolean>();
  const [deleteChatObject, setDeleteChatObject] = useState<any>();
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const http = new HttpService();

  const menus = [
    {
      key: 'home',
      title: 'Home',
      icon: <HomeIcon select={menu_select === 'home'} />
    },
    {
      key: 'bookmarks',
      title: 'Bookmarks',
      icon: <BookmarkIcon select={menu_select === 'bookmarks'} />
    },
    {
      key: 'chats',
      title: 'All Chats',
      icon: <ChatsIcon select={menu_select === 'chats'} />
    },
    {
      key: 'tips',
      title: 'Tips & Features',
      icon: <TipsIcon select={menu_select === 'tips'} />,
      disabled: true
    },
    {
      key: 'updates',
      title: 'Updates & FAQs',
      icon: <FaqIcon select={menu_select === 'updates'} />,
      disabled: true
    },
    {
      key: 'upgrade',
      title: 'Upgrade to Premium',
      icon: <UpgradeIcon select={menu_select === 'upgrade'} />
    },
    {
      key: 'logout',
      title: 'Logout',
      icon: <LogoutIcon select={menu_select === 'logout'} />
    }
  ];

  useEffect(() => {
    loadChats([]);
    if (menu_select === 'chats') {
      http.get('/chat/list_chat/').then((res: any) => {
        loadChats(res);
      });
    }
    if (menu_select === 'home') {
      router.push('/');
    }
    if (menu_select === 'bookmarks') {
      http.get('/chat/list_chat_bookmark/').then((res: any) => {
        loadChats(res);
      });
    }
    if (menu_select === 'upgrade') {
      router.push(`${process.env.NEXT_PUBLIC_TENSURF_URL}/plans`);
    }
    if (menu_select === 'logout') {
      Cookies.remove('tensurftoken');
      router.replace(process.env.NEXT_PUBLIC_TENSURF_URL as string);
    }
  }, [menu_select, loadChats, router]);

  useEffect(() => {
    if (chatKey) setMenuSelect('chats');
  }, [chatKey]);

  useEffect(() => {
    http.get('/account/get_my_profile/').then(res => {
      updateUserData(res);
    });
  }, []);

  const changeBookmark = (chat: any) => {
    toggleBookmark(chat.id);
    http
      .push('/chat/bookmark_chat/', {
        id: chat.id,
        bookmark: !chat.bookmark
      })
      .catch(() => {
        toggleBookmark(chat.id);
      });
  };

  const deleteChat = () => {
    setDeleteLoading(true);
    http
      .remove('/chat/delete_chat/', { id: deleteChatObject.id })
      .then(() => {
        setOpenDelete(false);
        console.log(deleteChatObject.id, 'id');

        dropChat(deleteChatObject.id);
      })
      .catch(() => {})
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  return (
    <html lang='en'>
      <body className={cn('h-screen bg-background font-sans antialiased m-0 p-0 flex', fontSans.variable)}>
        <Card
          className='flex flex-col w-1/5 bg-gpt rounded-none text-gpt-foreground'
          style={{ boxShadow: '0px 0px 6px 0px #FFFFFF36' }}
        >
          <CardContent className='flex items-center gap-4 my-2'>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <a href='/'>
                  <TooltipTrigger>
                    <ArrowLeftCircleIcon className='text-gpt-foreground cursor-pointer' />
                  </TooltipTrigger>
                </a>
                <TooltipContent>
                  <span className='text-xs'>Back to TenSurf Hub</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className='flex items-center gap-2 justify-center'>
              <Avatar className='w-12 h-12'>
                {/* <AvatarImage alt='profile'>
                  <UserRoundIcon />
                </AvatarImage> */}
                <AvatarFallback className='text-gpt'>
                  <UserRoundIcon />
                </AvatarFallback>
              </Avatar>
              <div className='truncate mt-2'>
                <h2 className='text-[22px] font-medium leading-6 truncate'>{userData?.full_name}</h2>
                <span className={`text-[10px] ${!userData?.full_name && 'text-[12px] font-bold'}`}>
                  {userData?.email}
                </span>
              </div>
            </div>
          </CardContent>
          <Separator />
          <div className='relative flex-grow overflow-y-auto'>
            <CardContent
              className={`px-8 flex flex-col absolute justify-start mt-4 transition-transform ${
                menu_select === 'chats' || menu_select === 'bookmarks' ? '-translate-x-[100%]' : 'translate-x-0'
              }`}
            >
              {menus.map((menu: any, index: number) => {
                return (
                  <Button
                    variant={'ghost'}
                    key={index}
                    className='text-wrap my-3 text-start hover:bg-gpt hover:text-gpt-select justify-start items-center gap-3'
                    onClick={() => setMenuSelect(menu.key)}
                    disabled={menu.disabled}
                  >
                    <div className='w-8'>{menu.icon}</div>
                    <span className={`text-start ${menu_select === menu.key && 'text-gpt-select'}`}>{menu.title}</span>
                  </Button>
                );
              })}
            </CardContent>
            <CardContent
              className={`px-8 flex flex-col justify-start mt-4 absolute transition-all top-0 w-full ${
                menu_select !== 'chats' && menu_select !== 'bookmarks' ? '-left-[100%] h-0' : 'left-0 h-full'
              }`}
            >
              {chats.map((chat: any, index: number) => {
                return (
                  <div className='flex justify-between gap-2' key={index}>
                    <Button
                      variant={'ghost'}
                      className={`text-wrap w-full my-2 text-start hover:bg-gpt hover:text-gpt-select items-center gap-1 justify-between ${
                        chatKey === chat.key
                          ? 'text-gpt bg-gpt-select hover:bg-gpt-select hover:text-gpt hover:opacity-80'
                          : ''
                      }`}
                      onClick={() => router.push(`/${chat.key}`)}
                    >
                      <div className=''>{chat.title}</div>

                      {/* <span
                    className={`text-start ${
                      menu_select === menu.key && "text-gpt-select"
                    }`}
                  >
                    {menu.title}
                  </span> */}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button
                          variant='ghost'
                          className='rounded-full hover:bg-gpt-select hover:text-gpt'
                          size={'icon'}
                        >
                          <EllipsisVerticalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className='w-56'>
                        {menu_select !== 'bookmarks' && (
                          <DropdownMenuItem>
                            <Button
                              variant={'ghost'}
                              // size={'icon'}
                              className='w-full flex justify-between'
                              onClick={() => changeBookmark(chat)}
                            >
                              Bookmark
                              <BookmarkIconLucide
                                className={`w-[18px] h-[18px] ${chat.bookmark ? 'fill-amber-500 text-amber-500' : ''}`}
                              />
                            </Button>
                          </DropdownMenuItem>
                        )}

                        {/* <DropdownMenuItem onClick={() => toggleAutoplay(!is_autoplay)}>
                          {is_autoplay ? (
                            <>
                              <VolumeX className='mr-2 w-4 h-4' />
                              <span>Disable autoplay</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className='mr-2 w-4 h-4' />
                              <span>Enable autoplay</span>
                            </>
                          )}
                        </DropdownMenuItem> */}

                        <DropdownMenuItem
                        // onClick={() => setOpenClear(true)}
                        >
                          <Button
                            variant={'ghost'}
                            className='w-full flex justify-between text-destructive hover:text-destructive'
                            onClick={() => {
                              setOpenDelete(true);
                              setDeleteChatObject(chat);
                            }}
                          >
                            Delete Chat
                            <TrashIcon className='w-[18px] h-[18px]' />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
              <Button
                className='mb-2 bg-gpt text-gpt-select w-full hover:bg-gpt hover:text-gpt-select mr-auto mt-auto'
                variant={'outline'}
                onClick={() => {
                  setMenuSelect('home');
                  setChatKey('');
                }}
              >
                Start a New Chat
              </Button>
            </CardContent>
          </div>
        </Card>
        {children}

        <Dialog open={openDelete} modal={openDelete} onOpenChange={e => setOpenDelete(e)}>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader className='flex flex-col gap-4'>
              <DialogTitle>Delete chat?</DialogTitle>
              <Separator />
              <DialogDescription>This will delete {deleteChatObject?.title}.</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                onClick={deleteChat}
                className='bg-destructive hover:bg-destructive w-24'
                disabled={deleteLoading}
              >
                {deleteLoading ? <Loader2Icon className='h-4 w-4 animate-spin' /> : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </body>
    </html>
  );
}
