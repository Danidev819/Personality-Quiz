import React, { useContext } from "react";
import { UserContext } from "./UserContext";

export default function Results({ element, artwork }) {
	const { name } = useContext(UserContext);

	return (
		<div>
			<p>
				{(name && <strong>{name}</strong>) || ""} your element is: {element}
			</p>
			{artwork ? (
				<div className="artwork">
					<h2>{artwork.title}</h2>
					<img src={artwork.primaryImage} alt={artwork.title} />
					<p>{artwork.artisDisplayName}</p>
					<p>{artwork.objectDate}</p>
				</div>
			) : (
				<p>No artwork found.</p>
			)}
		</div>
	);
}
