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
    const [bids, setBids] = useState([])
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
            setError(api.getErrorMessage(error))
        }
    }

    if (!item) return <div className="container">Загрузка...</div>

    return (
        <div className="container">
            <Link to={'/'}>← Вернуться к списку товаров</Link>

            <div className="item-detail">
                <div className="item-header">
                    <div>
                        <img src={item.imageUrl} className="item-image-large" />
                    </div>

                    <div className="item-info">
                        <span className="item-status">Активное</span>

                        <h1 className="item-title-large">{item.title}</h1>

                        <div className="item-seller-info">
                            <div className="seller-avatar">Первые 2 символа с юзернейма</div>
                            <div className="seller-details">
                                <div className="seller-name">{item.username}
                                </div>
                                <div className="seller-date">{new Date(item.createdAt).toLocaleString("ru-RU")}
                                </div>
                            </div>
                        </div>

                        <div className="item-description-full">{item.description}
                        </div>

                        {isOwner && (
                            <Button type="button" onClick={handleDelete}>
                                Удалить товар
                            </Button>
                        )}

                        <div className="price-section">
                            <div className="starting-price">Начальная цена:</div>
                            <div className="current-price">{item.price}</div>
                            <div className="highest-bid">
                                Текущая ставка: {item.highestBid ?? "Ставок нет"}
                            </div>

                            {error && (
                                <div classNameName='alert alert-error active'>
                                    {error}
                                </div>
                            )}

                            <form className="bid-form" onSubmit={handleBid}>
                                <Input
                                    type="number"
                                    name="bidInput"
                                    className="bid-input"
                                    placeholder="Введите вашу ставку (мин. стоимость + 1 рубль ₽)"
                                    min={item.highestBid ?? item.price}
                                    step="100"
                                />
                                <Button type="submit" className="btn-bid">
                                    Сделать ставку
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="bids-section">
                    <div className="bids-header">
                        <h2 className="bids-title">История ставок</h2>
                        <span className="bids-count">{bids.length}</span>
                    </div>
                    
                    {bids.map((bid, index) => (
                    <div className="bids-list">
                        <div className={`bid-item ${index === 0 ? "highest-bid-item" : ""}`} key={bid.id}>
                            <div className="bid-user">
                                <div className="bid-avatar">{bid.username.slice(0, 2).toUpperCase()}</div>
                                <div className="bid-details">
                                    <span className="bid-username">{bid.username}</span>
                                    <span className="bid-time">{new Date(bid.createdAt).toLocaleString("ru-RU")}</span>
                                </div>
                                {index ===0 && (
                                    <span className="highest-badge">🏆 Лидирует</span>
                                    )}
                            </div>
                            <div className="bid-amount">{bid.amount} ₽</div>
                        </div>
                    </div>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default ItemDetail
