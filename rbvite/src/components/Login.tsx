import { FormEvent, useRef } from 'react';
import { useSession } from '../contexts/session.context';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const Login = () => {
  const { login } = useSession();
  const navigate = useNavigate();

  //===== ref =====
  const idRef = useRef<HTMLInputElement | null>(null);

  //===== function =====
  const loginValidation = (id: number) => {
    // 과도한 검증인것 같아 제외, input type이 number
    // if (typeof id != 'number') {
    //   alert('invalid type! ID should be number');
    //   return false;
    // }

    if (!id) {
      idRef.current?.focus();
      return false;
    }

    if (id < 1 || id > 10) {
      alert('Invalid value! ID must be a number between 1 to 10');
      return false;
    }

    return true;
  };

  //===== handlers =====
  const loginHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = Number(idRef.current?.value);

    if (!loginValidation(id)) {
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/users?id=${id}`);
      const data = await res.json();

      const name = await data[0].name;

      if (!name) {
        alert('No such user');
      }

      if (login(id, name)) navigate('/');
      else alert('Login Failed');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1 className='text-xl mb-5 text-hana font-extrabold'>Sign In</h1>
      <form onSubmit={loginHandler}>
        <label htmlFor='login'>
          ID
          <input
            id='login'
            type='number'
            ref={idRef}
            className='border border-hana m-1 ml-5 pl-2 p-1 rounded'
            placeholder='Please enter a number'
            min='1'
          />
        </label>

        <button
          type='submit'
          className='bg-hana text-zinc-50 mt-3 font-bold rounded-full pl-2 pr-2 p-1'
        >
          Log-in
        </button>
      </form>
    </>
  );
};
