import { useSession } from '../contexts/session.context';
import { useFetch } from '../hooks/fetch';
import { Album } from './Album';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';
import clsx from 'clsx';

type Album = {
  userId: number;
  id: number;
  title: string;
};

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const Albums = () => {
  //===== data =====

  //loginUser
  const {
    session: { user: loginUser },
  } = useSession();

  //albums
  const { data: albums, isLoading } = useFetch<Album[]>({
    url: `${BASE_URL}/albums?userId=${loginUser?.id}`,
    dependency: [loginUser],
    enable: !(loginUser === null),
  });

  //===== states =====
  //selected
  const [query, setQuery] = useSearchParams({ albumId: '' });
  const selectedAlbumId = query.get('albumId');

  //===== hooks =====
  const navigate = useNavigate();

  //===== handlers =====
  const goTo = useCallback(
    (id: number | null) => {
      if (id) {
        navigate(`/albums/detail/${id}`);
        return;
      } else {
        alert('Select an album');
        return;
      }
    },
    [navigate]
  );

  const selectHandler = (id: number) => {
    if (Number(selectedAlbumId) === id) {
      setQuery({});
    } else {
      setQuery({ albumId: String(id) });
    }
  };

  return (
    <>
      <div className='container max-w-2xl mx-auto'>
        <h1 className='font-semibold text-xl text-start pl-7 p-3 border-b-2 border-hana '>
          <strong>{loginUser ? `${loginUser?.name}'s  ` : `...`}</strong>Album
          List
        </h1>
        {loginUser && isLoading ? <h1>isLoading...</h1> : null}
        {albums ? (
          <ul className='text-start border-b-2 border-b-hana'>
            {albums?.map((item, index) => (
              <li
                key={item.id}
                className={clsx({
                  ' hover:bg-slate-50': true,
                  'border-b-2 border-zinc-100': item.id != albums?.length,
                })}
              >
                <button
                  onClick={() => selectHandler(item.id)}
                  className={clsx('w-full h-full flex p-4', 'text-start', {
                    'font-extrabold bg-slate-200':
                      Number(selectedAlbumId) === item.id,
                  })}
                >
                  <div className='mr-10'>{index + 1}</div>
                  <div>
                    <Album albumId={item.id} album={item} />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <button
          onClick={() => goTo(Number(selectedAlbumId))}
          className='bg-hana rounded-full font-semibold text-zinc-50 p-2 mt-4 hover:border hover:border-hana hover:bg-transparent hover:text-hana w-1/4 '
        >
          Details
        </button>
      </div>
    </>
  );
};
