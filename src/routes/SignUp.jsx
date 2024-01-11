import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

import "../css/SignUp.css";

function Validator({ control, name, validatePasswordConfirm }) {
    const inputData = useWatch({
        control,
        name: name,
    });

    const validationPatterns = {
        emailLength: inputData.length >= 6 && inputData.length <= 35,
        passwordLength: inputData.length >= 8 && inputData.length <= 20,
        passwordRegex:
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-])[a-zA-Z\d!@#$%^&*()_+{}[\]:;<>,.?~\\/-]{8,20}$/,
        nicknameRegex: /^[a-zA-Z0-9가-힣]{2,16}$/,
        realnameRegex: /^[a-zA-Z가-힣]{2,}$/,
        ageRegex: /^(1[4-9]|[2-9][0-9]|100)$/,
    };

    const validationMessage = <div>필수 입력란을 확인하세요.</div>;

    switch (name) {
        case "email":
            if (inputData === "") {
                return validationMessage;
            } else {
                return (
                    <div
                        className={
                            validationPatterns.emailLength
                                ? "checked"
                                : "unchecked"
                        }
                    >
                        이메일은 6자 이상 35자 이하로 입력하세요.
                    </div>
                );
            }
        case "password":
            if (inputData === "") {
                return validationMessage;
            } else {
                return (
                    <div>
                        <div
                            className={
                                validationPatterns.passwordLength
                                    ? "checked"
                                    : "unchecked"
                            }
                        >
                            비밀번호는 8자 이상 20자 이하로 입력하세요.
                        </div>
                        <div
                            className={
                                validationPatterns.passwordRegex.test(inputData)
                                    ? "checked"
                                    : "unchecked"
                            }
                        >
                            비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상
                            20자 이하로 입력하세요.
                        </div>
                    </div>
                );
            }
        case "passwordConfirm":
            if (inputData === "") {
                return validationMessage;
            } else {
                return (
                    <div
                        className={
                            validatePasswordConfirm(inputData)
                                ? "checked"
                                : "unchecked"
                        }
                    >
                        {validatePasswordConfirm(inputData)
                            ? "비밀번호가 일치 합니다."
                            : "비밀번호가 일치하지 않습니다."}
                    </div>
                );
            }
        case "nickname":
            if (inputData === "") {
                return validationMessage;
            } else {
                return (
                    <div
                        className={
                            validationPatterns.nicknameRegex.test(inputData)
                                ? "checked"
                                : "unchecked"
                        }
                    >
                        닉네임은 2자 이상 16자 이하의 영문, 숫자, 한글로
                        입력하세요.
                    </div>
                );
            }
        case "realname":
            if (inputData === "") {
                return validationMessage;
            } else {
                return (
                    <div
                        className={
                            validationPatterns.realnameRegex.test(inputData)
                                ? "checked"
                                : "unchecked"
                        }
                    >
                        실명은 2자 이상의 영문 또는 한글로 입력하세요.
                    </div>
                );
            }
        case "age":
            return (
                <div
                    className={
                        validationPatterns.ageRegex.test(inputData)
                            ? "checked"
                            : "unchecked"
                    }
                >
                    나이는 14세 이상 100세 이하로 입력하세요.
                </div>
            );
        default:
            return null;
    }
}

function SignUp() {
    const [onFocusInput, setOnFocusInput] = useState("");
    const [checkEmail, setCheckEmail] = useState(false);
    const [checkNickname, setCheckNickname] = useState(false);

    const { register, handleSubmit, control, getValues, setValue } = useForm();

    const navigate = useNavigate();

    const onSubmit = (data) => {
        if (checkEmail && checkNickname && data) {
            //서버 통신 후 메인 페이지 이동
            Axios.post("/signup", {
                email: data.email,
                emailChecked: data.emailAvailable,
                password: data.password,
                confirmPassword: data.passwordConfirm,
                nickname: data.nickname,
                name: data.realname,
                age: data.age,
            }).then(() => {
                navigate("/");
            });
        }
    };

    const validatePasswordConfirm = (value) => {
        const password = getValues("password");
        return value === password;
    };

    const checkEmailAvaliable = () => {
        // 서버 통신 후 중복 검사 통과 시
        setCheckEmail(true);
        setValue("emailAvailable", "true");
    };

    const checkNicknameAvaliable = () => {
        // 서버 통신 후 중복 검사 통과 시
        setCheckNickname(true);
        setValue("nicknameAvailable", "true");
    };

    console.log(typeof getValues("emailAvailable"));

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="email"
                    {...register("email", {
                        required: true,
                        minLength: {
                            value: 6,
                        },
                        maxLength: {
                            value: 35,
                        },
                    })}
                    placeholder="email"
                    autoComplete="email"
                    onFocus={(item) => setOnFocusInput(item.target.name)}
                    disabled={checkEmail}
                />
                {onFocusInput && onFocusInput === "email" ? (
                    <Validator control={control} name={onFocusInput} />
                ) : null}
                <button
                    type="button"
                    onClick={checkEmailAvaliable}
                    disabled={checkEmail}
                >
                    이메일중복
                </button>
                <input
                    type="hidden"
                    {...register("emailAvailable")}
                    value={false}
                />
                <input
                    type="password"
                    {...register("password", {
                        required: true,
                        pattern: {
                            value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-])[a-zA-Z\d!@#$%^&*()_+{}[\]:;<>,.?~\\/-]{8,20}$/,
                        },
                    })}
                    placeholder="password"
                    autoComplete="current-password"
                    onFocus={(item) => setOnFocusInput(item.target.name)}
                />
                {onFocusInput && onFocusInput === "password" ? (
                    <Validator control={control} name={onFocusInput} />
                ) : null}
                <input
                    type="password"
                    {...register("passwordConfirm", {
                        required: true,
                        validate: validatePasswordConfirm,
                    })}
                    placeholder="password confirm"
                    autoComplete="current-password"
                    onFocus={(item) => setOnFocusInput(item.target.name)}
                />
                {onFocusInput && onFocusInput === "passwordConfirm" ? (
                    <Validator
                        control={control}
                        name={onFocusInput}
                        validatePasswordConfirm={validatePasswordConfirm}
                    />
                ) : null}
                <input
                    type="text"
                    {...register("nickname", {
                        required: true,
                        pattern: {
                            value: /^[a-zA-Z0-9가-힣]{2,16}$/,
                        },
                        minLength: {
                            value: 2,
                        },
                        maxLength: {
                            value: 16,
                        },
                    })}
                    placeholder="nickname"
                    autoComplete="nickname"
                    onFocus={(item) => setOnFocusInput(item.target.name)}
                    disabled={checkNickname}
                />
                {onFocusInput && onFocusInput === "nickname" ? (
                    <Validator control={control} name={onFocusInput} />
                ) : null}
                <button
                    type="button"
                    onClick={checkNicknameAvaliable}
                    disabled={checkNickname}
                >
                    닉네임중복
                </button>
                <input
                    type="hidden"
                    {...register("nicknameAvailable")}
                    value={false}
                />
                <input
                    type="text"
                    {...register("realname", {
                        required: true,
                        pattern: {
                            value: /^[a-zA-Z가-힣]{2,}$/,
                        },
                        minLength: {
                            value: 2,
                        },
                    })}
                    placeholder="realname"
                    autoComplete="realname"
                    onFocus={(item) => setOnFocusInput(item.target.name)}
                />
                {onFocusInput && onFocusInput === "realname" ? (
                    <Validator control={control} name={onFocusInput} />
                ) : null}
                <input
                    type="number"
                    {...register("age", {
                        minLength: {
                            value: 2,
                        },
                        pattern: {
                            value: /^(1[4-9]|[2-9][0-9]|100)$/,
                        },
                    })}
                    placeholder="age"
                    autoComplete="age"
                    onFocus={(item) => setOnFocusInput(item.target.name)}
                    className="www"
                />
                {onFocusInput && onFocusInput === "age" ? (
                    <Validator control={control} name={onFocusInput} />
                ) : null}
                <input type="submit" value="회원가입" />
            </form>
        </div>
    );
}

export default SignUp;
