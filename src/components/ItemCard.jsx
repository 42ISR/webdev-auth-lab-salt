import { Link } from "react-router-dom"

const ItemCard = ({item}) => {
    return (
        <Link to={`/item/${item.id}`} className="item-card">
            <img src="" className="item-image" />
            <div className="item-content">
                <span className="status-badge status-active">Активное</span>
                <h3 className="item-title">{item.title}</h3>
                <p className="item-description">{item.description}</p>
                <div className="item-footer">
                    <div>
                        <div className="item-price">{item.starting_price} ₽</div>
                        <div className="bid-info">
                            5000 P
                            <span className="bid-count">2</span>
                        </div>
                    </div>
                    <div className="item-meta">
                        <span className="item-seller">Продавец: {item.saller?.username}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ItemCard
