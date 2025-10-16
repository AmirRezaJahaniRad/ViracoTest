import React, { useEffect } from "react";
import {toast} from "react-toastify"
import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form'

import { Typography  } from "@mui/material";

import { AuthButton , AuthInput } from "../../components/index"
import AuthLayout from "../../layouts/AuthLayout";
import { checkUser } from '../../lib/authAxios.ts'
import {type loginFormProps } from "../../types/types.ts"
import useAuthStore from "../../store/AuthStore.ts";

const LoginPage: React.FC = () => {
  const form = useForm<loginFormProps>({
      defaultValues: {
        usercode : "",
        password : "",
      }, 
      mode: "all",
     });

  const { register , handleSubmit , formState , reset} = form;
  const {errors , isDirty} = formState; 
  const navigate = useNavigate();

  const {showToast , setToast , resetToast } = useAuthStore();

  const CheckingID = async (data:loginFormProps) => {
    try {
      const res = await checkUser(data)
    if (res.status == 200) {
      toast.success("با موفقیت وارد شدید")
      setTimeout(() => { navigate("/selectCompany") } ,3000)
    }
    }
    catch {
      toast.error("مجدد امتحان کنید");
      reset()
    }
  }

  const onSubmit = (data : loginFormProps) => {
    if (isDirty) {
      CheckingID(data)
    }
    else {
      toast.error("لطفا تیک قوانین را بزنید")
    }}

    useEffect( () => {
      console.log("SHOW TOAST VALUE: ",showToast);
      if (showToast) {
        toast.success("با موفقیت ثبت نام شدید!")
      }
    } , [showToast , setToast , resetToast])

  return (
    <>
     <AuthLayout>
      <Typography variant="h5" className="mb-6 font-bold text-center">
            ورود
          </Typography>

          <form noValidate autoComplete="off" className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <AuthInput label="نام کاربری" id="username" type="text" register={register("usercode", {
                          required: "نام کاربری خود را وارد کنید",
                          maxLength:100,
                          pattern:{
                            value: /^[A-Za-z0-9آ-ی]+$/ ,
                            message: "فقط اعداد و حروف مجاز است"
                            
                          }
                        })}/>
            <p className="authErrorMessage">{errors.usercode?.message}</p>
            <AuthInput label="رمز عبور" type="password" id="password"  register={register("password", {
                          required: "رمز عبور خود را وارد کنید",
                          minLength:{
                            value : 8,
                            message : "حداقل 8 کارکتر وارد کنید"
                          },
                          maxLength:{
                            value : 16,
                            message : "حداکثر 16 کارکتر وارد کنید"
                          },
                          pattern: {
                          value: /^(?=.*[A-Za-zآ-ی])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{8,}$/,
                          message: "رمز عبور باید حداقل ۸ کاراکتر و شامل یک حرف، یک عدد و یک کاراکتر خاص باشد",}
                        })} />
              <p className="authErrorMessage">{errors.password?.message}</p>

            <AuthButton type="submit">ورود</AuthButton>
          </form>



          {/* لینک‌ها */}
          <div className="flex w-full justify-between mt-4 px-5 text-sm">
            <Link to="/register" className="authLink">
              ثبت نام
            </Link>
            <Link to="/forgotPassword" className="authLink">
              فراموشی رمز عبور
            </Link>
            <Link to="/mainDashboard" className="authLink">
                        داشبورد اصلی
            </Link>
          </div>
    </AuthLayout>
    </>
  );
};

export default LoginPage;