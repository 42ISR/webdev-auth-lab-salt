import { useState } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import { Link } from 'react-router-dom'
import { api } from "../api/api"
import { useNavigate } from "react-router-dom"
import { useUserStore } from "../store/useUserStore"

const Register = () => {
    const navigate = useNavigate()
    const { setSession } = useUserStore()
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        const user = {
            username: e.target.username.value,
            password: e.target.password.value,
        }

        if (e.target.email.value){
            user.email = e.target.email.value
        }

        if (e.target.password.value !== e.target.password2.value)
            return setError("Пароли не совпадают")

        try {
            const data = await api.registerUser(user)
            setSession(data)
            navigate("/")
        } catch (error) {
            console.error(error)
            setError(error.response?.data?.error || "Ошибка регистрации")
        }
    }

    return (
        <div className="container">
            <div className="auth-container">
                <div className="auth-header">
                    <div className="auth-icon">👤</div>
                    <h1 className="auth-title">Регистрация</h1>
                    <p className="auth-subtitle">Создайте новый аккаунт</p>
                </div>
                {error && (
                <div className=" alert alert-error active">{error}</div>
                )}
                <form id="register-form" onSubmit= {handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Имя пользователя</label>
                        <Input
                            type="text"
                            className="form-input"
                            name="username"
                            placeholder="Введите имя пользователя"
                            minlength="3"
                            required
                            autocomplete="username"
                        />
                        <div className="form-hint">Минимум 3 символа</div>
                        <div className="form-error">
                            Имя пользователя должно быть не менее 3 символов
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Email <span className="optional">(необязательно)</span>
                        </label>
                        <Input
                            type="email"
                            className="form-input"
                            name="email"
                            placeholder="example@email.com"
                            autocomplete="email"
                        />
                        <div className="form-error">Введите корректный email</div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Пароль</label>
                        <Input
                            type="password"
                            className="form-input"
                            name="password"
                            placeholder="Введите пароль"
                            minlength="6"
                            required
                            autocomplete="new-password"
                        />
                        <div className="password-strength">
                            <div
                                className="password-strength-bar"
                                id="password-strength-bar"></div>
                        </div>
                        <div className="form-hint">Минимум 6 символов</div>
                        <div className="form-error">
                            Пароль должен быть не менее 6 символов
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Подтверждение пароля</label>
                        <Input
                            type="password"
                            className="form-input"
                            name="password2"
                            placeholder="Повторите пароль"
                            required
                            autocomplete="new-password"
                        />
                        <div className="form-error">Пароли не совпадают</div>
                    </div>

                    <Button type="submit" className="btn-submit">
                        Зарегистрироваться
                    </Button>
                </form>

                <div className="auth-divider">или</div>

                <div className="auth-link">
                    <p>
                        <Link to={'/login'}>Войти</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register
