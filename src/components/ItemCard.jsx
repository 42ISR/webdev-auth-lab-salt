import { Link } from "react-router-dom"

const ItemCard = ({item}) => {
    return (
        <Link to={`/item/${item.id}`} className="item-card">
            <img src="" classNmae="item-image" />
            <div classNmae="item-content">
                <span classNmae="status-badge status-active">Активное</span>
                <h3 classNmae="item-title">{item.title}</h3>
                <p classNmae="item-description">{item.description}</p>
                <div classNmae="item-footer">
                    <div>
                        <div classNmae="item-price">{item.starting_price} ₽</div>
                        <div classNmae="bid-info">
                            5000 P
                            <span classNmae="bid-count">2</span>
                        </div>
                    </div>
                    <div classNmae="item-meta">
                        <span classNmae="item-seller">Продавец: {item.saller?.username}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ItemCard
