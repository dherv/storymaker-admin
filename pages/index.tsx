import type { NextPage } from "next";
import Head from 'next/head';
import { FC } from 'react';
import {
  FieldError,
  Path,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from 'react-hook-form';

type Inputs = {
  title: string;
  category: string;
  files: FileList;
};

const FormInput: FC<{
  label: Path<Inputs>;
  placeholder: string;
  register: UseFormRegister<Inputs>;
  error?: FieldError;
}> = ({ label, placeholder, error, register }) => {
  const errorClass = `border-pink-500 text-pink-600 focus:border-pink-500 focus:ring-pink-500`;
  const okClass = `border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600`;
  return (
    <div className="mb-3">
      <label className="block font-medium">{label}</label>
      <input
        type="text"
        aria-invalid={error ? "true" : "false"}
        {...register(label, { required: true })}
        className={`
        peer w-full px-4 py-2 mt-2 border rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none  transition duration-300 ease-in-out
        ${error ? errorClass : okClass}`}
        placeholder={placeholder}
      ></input>
      <p
        className={`${
          error ? "visible" : "invisible"
        } mt-1 ml-1 text-pink-600 text-xs`}
      >
        {`Please enter a ${label}`}
      </p>
    </div>
  );
};

const FormInputFile: FC<{
  label: Path<Inputs>;
  placeholder: string;
  register: UseFormRegister<Inputs>;
  error?: FieldError;
}> = ({ label, error, register }) => {
  const errorClass = `text-pink-600  file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100`;
  const okClass = `file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100`;
  return (
    <div className="my-6">
      <label className="block">
        <span className="sr-only">choose a novel</span>
        {/* TODO: add the accept property */}
        <input
          type="file"
          aria-invalid={error ? "true" : "false"}
          {...register(label, { required: true })}
          className={`block  w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100
                hover:cursor-pointer
                file:hover:cursor-pointer
                ${error ? errorClass : okClass}
                `}
        />
      </label>
      <p
        className={`${
          error ? "visible" : "invisible"
        } mt-1 ml-1 text-pink-600 text-xs`}
      >
        {`Please upload a file`}
      </p>
    </div>
  );
};

const Home: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = ({ title, category, files }) => {
    const formData = new FormData();
    formData.append("file", files[0], files[0].name);

    formData.append("title", title);
    formData.append("category", category);

    fetch("https://path/to/api", {
      // content-type header should not be specified!
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((success) => {
        // Do something with the successful response
      })
      .catch((error) => console.log(error));
  };
  return (
    <div>
      <Head>
        <title>Storymaker</title>
        <meta name="description" content="CMS to upload a novel to a blog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="p-6">
        <h1 className="font-black text-4xl">Storymaker</h1>
      </header>
      <main className="p-6 my-6 h-max">
        <form
          className="block max-w-xl mx-auto p-6 shadow-md"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="font-bold text-2xl mb-12">Upload your novel</h2>
          <FormInput
            error={errors.title}
            placeholder="blood and flowers"
            label="title"
            register={register}
          />
          <FormInput
            error={errors.category}
            placeholder="cyberpunk"
            label="category"
            register={register}
          />
          <FormInputFile
            error={errors.files}
            placeholder="choose a file"
            label="files"
            register={register}
          />
          <div className="flex">
            <button
              type="submit"
              disabled={Object.values(errors).length > 0}
              className="mt-12 px-4 py-1 ml-auto bg-indigo-500 text-white disabled:opacity-50"
            >
              submit
            </button>
          </div>
        </form>
      </main>
      <footer></footer>
    </div>
  );
};

export default Home;
