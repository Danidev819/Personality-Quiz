import React, { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { UserProvider } from "./components/UserContext";
import UserForm from "./components/UserForm";
import Question from "./components/Question";
import Results from "./components/Results";

function App() {
	const questions = [
		{
			question: "What's your favorite color?",
			options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
		},
	];
	const keywords = {
		Fire: "fire",
		Water: "water",
		Earth: "earth",
		Air: "air",
	};
	const elements = {
		"Red 🔴": "Fire",
		"Blue 🔵": "Water",
		"Green 🟢": "Earth",
		"Yellow 🟡": "Air",
		// Continue mapping all your possible options to a keyword
	};

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState([]);
	const [username, setUserName] = useState("");
	const [element, setElement] = useState("");
	const [artwork, setArtwork] = useState(null);

	const handleAnswer = (answer) => {
		setAnswers([...answers, answer]);
		setCurrentQuestionIndex(currentQuestionIndex + 1);
	};

	const handleUserFormSubmit = (name) => {
		setUserName(name);
	};

	const determineElement = (answers) => {
		const counts = {};
		for (const answer of answers) {
			const element = elements[answer];
			counts[element] = (counts[element] || 0) + 1;
		}
		return Object.keys(counts).reduce((a, b) =>
			counts[a] > counts[b] ? a : b,
		);
	};

	useEffect(() => {
		if (currentQuestionIndex === questions.length) {
			const objectId = Math.floor(Math.random() * 100) + 1;
			const selectedElement = determineElement(answers);
			setElement(selectedElement);
			async function fetchImage() {
				const response = await fetch(
					`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`,
				);
				const data = await response.json();
				setArtwork(data);
			}

			fetchImage();
		}
	}, [currentQuestionIndex]);

	return (
		<UserProvider value={{ name: username, setName: setUserName }}>
			<Header />
			<Routes>
				<Route
					path="/"
					element={<UserForm onSubmit={handleUserFormSubmit} />}
				/>
				<Route
					path="/quiz"
					element={
						currentQuestionIndex < questions.length ? (
							<Question
								question={questions[currentQuestionIndex].question}
								options={questions[currentQuestionIndex].options}
								onAnswer={handleAnswer}
							/>
						) : (
							<Results element={element} artwork={artwork} />
						)
					}
				/>
			</Routes>
		</UserProvider>
	);
}

export default App;
