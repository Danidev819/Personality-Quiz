import React, { useEffect, useState } from "react";
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
	const [artwork, setArtWork] = useState(null);

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

	async function fetchImage() {
		try {
			const response = await fetch(
				"https://collectionapi.metmuseum.org/public/collection/v1/search",
			);
			const data = await response.json();
			setArtWork(data.message);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		if (currentQuestionIndex === questions.length) {
			const selectedElement = determineElement(answers);
			setElement(selectedElement);
			fetchImage(keywords[selectedElement]);
		}
	}, [currentQuestionIndex]);

	return (
		<UserProvider>
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
