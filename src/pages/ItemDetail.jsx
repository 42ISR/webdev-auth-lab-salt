import { Link } from 'react-router-dom'
import Input from '../components/Input'
import Button from '../components/Button'
import { useState, useEffect } from 'react'
import { useItemStore } from '../store/useItemStore'
import { useParams } from 'react-router-dom'
import { api } from '../api/api'
import { useUserStore } from '../store/useUserStore'
import { useNavigate } from 'react-router-dom'

const ItemDetail = () => {

    const { id } = useParams()
    const items = useItemStore((state) => state.items)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const getItems = useItemStore((state) => state.getItems)
    const item = items.find((item) => item.id === Number(id))
    const session = useUserStore((state) => state.session)
    const isOwner = session?.user?.id === item?.userId
    const navigate = useNavigate()

    useEffect(() => {
        getItems()
    }, [id])

    const loadBids = async () => {
        try {
            const data = await api.getItemBids(id)
            setBids(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() =>{
        loadBids()
    }, [id])

    const handleBid = async (e) => {
    e.preventDefault()
    setError('')

    const form = e.target
    const amount = Number(form.bidInput.value)

    try {
        await api.createBid({ id, amount })
        form.reset()
        await getItems()
        await loadBids()
    } catch (err) {
        setError(api.getErrorMessage(err))
    }
}

    const handleDelete = async () => {
        try {
            await api.deleteItems(id)
            await getItems()
            navigate("/")
        } catch (error) {
            setError(api.getErrorMessage(err))
        }
    }

    if (!item) return <div className="container">Загрузка...</div>

    return (
        <div className="container">
            <Link to={'/'}>← Вернуться к списку товаров</Link>

            <div class="item-detail">
                <div class="item-header">
                    <div>
                        <img src={item.imageUrl} class="item-image-large" />
                    </div>

                    <div class="item-info">
                        <span class="item-status">Активное</span>

                        <h1 class="item-title-large">{item.title}</h1>

                        <div class="item-seller-info">
                            <div class="seller-avatar">Первые 2 символа с юзернейма</div>
                            <div class="seller-details">
                                <div class="seller-name">{item.username}
                                </div>
                                <div class="seller-date">{new Date(item.createdAt).toLocaleString("ru-RU")}
                                </div>
                            </div>
                        </div>

                        <div class="item-description-full">{item.description}
                        </div>

                        {isOwner && (
                            <Button type="button" onClick={handleDelete}>
                                Удалить товар
                            </Button>
                        )}

                        <div class="price-section">
                            <div class="starting-price">Начальная цена:</div>
                            <div class="current-price">{item.price}</div>
                            <div class="highest-bid">
                                Текущая ставка: {item.highestBid ?? "Ставок нет"}
                            </div>

                            {error && (
                                <div className='alert alert-error active'>
                                    {error}
                                </div>
                            )}

                            <form class="bid-form" onSubmit={handleBid}>
                                <Input
                                    type="number"
                                    name="bidInput"
                                    class="bid-input"
                                    placeholder="Введите вашу ставку (мин. стоимость + 1 рубль ₽)"
                                    min={item.highestBid ?? item.price}
                                    step="100"
                                />
                                <Button type="submit" class="btn-bid">
                                    Сделать ставку
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="bids-section">
                    <div class="bids-header">
                        <h2 class="bids-title">История ставок</h2>
                        <span class="bids-count">{bids.length}</span>
                    </div>
                    
                    {bids.map((bid, index) => (
                    // <div class="bids-list">
                    //     <div class="bid-item highest-bid-item">
                        <div className={`bid-item ${index === 0 ? "highest-bid-item" : ""}`} key={bid.id}>
                            <div class="bid-user">
                                <div class="bid-avatar">{bid.username.slice(0, 2).toUpperCase()}</div>
                                <div class="bid-details">
                                    <span class="bid-username">{bid.username}</span>
                                    <span class="bid-time">{new Date(bid.createdAt).toLocaleString("ru-RU")}</span>
                                </div>
                                {index ===0 && (
                                    <span class="highest-badge">🏆 Лидирует</span>
                                    )}
                            </div>
                            <div class="bid-amount">{bid.amount} ₽</div>
                        </div>
                        ))}

                        <div class="bid-item">
                            <div class="bid-user">
                                <div class="bid-avatar">JD</div>
                                <div class="bid-details">
                                    <span class="bid-username">john_doe</span>
                                    <span class="bid-time">5 часов назад</span>
                                </div>
                            </div>
                            <div class="bid-amount">68 000 ₽</div>
                        </div>

                        <div class="bid-item">
                            <div class="bid-user">
                                <div class="bid-avatar">AL</div>
                                <div class="bid-details">
                                    <span class="bid-username">alice_tech</span>
                                    <span class="bid-time">1 день назад</span>
                                </div>
                            </div>
                            <div class="bid-amount">67 000 ₽</div>
                        </div>

                        <div class="bid-item">
                            <div class="bid-user">
                                <div class="bid-avatar">MK</div>
                                <div class="bid-details">
                                    <span class="bid-username">mike_k</span>
                                    <span class="bid-time">1 день назад</span>
                                </div>
                            </div>
                            <div class="bid-amount">66 000 ₽</div>
                        </div>

                        <div class="bid-item">
                            <div class="bid-user">
                                <div class="bid-avatar">ST</div>
                                <div class="bid-details">
                                    <span class="bid-username">sarah_tech</span>
                                    <span class="bid-time">2 дня назад</span>
                                </div>
                            </div>
                            <div class="bid-amount">65 500 ₽</div>
                        </div>
                    </div>
                </div>
            </div>
        // </div>
    )
}

export default ItemDetail
