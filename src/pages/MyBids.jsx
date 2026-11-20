import { useState, useEffect } from 'react'
import { api } from '../api/api'
import { Link } from 'react-router-dom'

const MyBids = () => {

    const [bids, setBids] = useState([])

    useEffect(() =>{
        const loadBids = async () =>{
            try {
                const data = await api.getMyBids()
                setBids(data)
            } catch (error) {
                console.error(error)
            }
        }
        loadBids()
    }, [])

    const winningCount = bids.filter((bid) => bid.isWinning).length
    const totalAmount = bids.reduce((sum, bid) => sum + bid.amount, 0)

    return (
        <div className="container">

            <div className="page-header">
                <h1>Мои ставки</h1>
                <p className="page-subtitle">История ваших ставок на товары</p>
            </div>

            <div className="bids-summary">
                <div className="summary-card">
                    <span className="summary-value">{bids.length}</span>
                    <span className="summary-label">Всего ставок</span>
                </div>
                <div className="summary-card winning">
                    <span className="summary-value">{winningCount}</span>
                    <span className="summary-label">Лидирующих ставок</span>
                </div>
                <div className="summary-card">
                    <span className="summary-value">{ totalAmount } ₽</span>
                    <span className="summary-label">Общая сумма</span>
                </div>
            </div>
            
            <div className="bids-list">
                {bids.map((bid) => (
                <div className="bid-item" key={bid.id}>
                    <div className="bid-item-content">
                        <div className="bid-item-header">
                            <Link to={`/item/${bid.itemId}`} className="bid-item-title">
                            {bid.itemTitle}
                            </Link>
                            <span className={bid.isWinning ? "winning-badge" : "outbid-badge"}>{bid.isWinning ? "🏆 Лидирую" : "Перебита"}</span>
                        </div>
                        <div className="bid-item-meta">
                            {new Date(bid.createAt).toLocaleString("ru_RU")}
                        </div>
                    </div>
                    <div className="bid-item-amount">
                        <span className="bid-amount">{bid.amount} ₽</span>
                    </div>
                </div>
                ))}
            </div>
        </div>
        

    )
}

export default MyBids
