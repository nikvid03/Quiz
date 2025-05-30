import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, Trophy, Clock, SkipForward, Zap, Star, Target, Award, Volume2, VolumeX } from 'lucide-react';

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [powerUps, setPowerUps] = useState({ fiftyFifty: 2, extraTime: 2, doublePoints: 2 });
  const [usedPowerUps, setUsedPowerUps] = useState({});
  const [points, setPoints] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [achievements, setAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [showHint, setShowHint] = useState(false);

  const difficulties = {
    easy: { time: 45, pointMultiplier: 1, name: 'Easy' },
    medium: { time: 30, pointMultiplier: 1.5, name: 'Medium' },
    hard: { time: 15, pointMultiplier: 2, name: 'Hard' }
  };

  const questions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct: "Paris",
      hint: "This city is known as the 'City of Light' and home to the Eiffel Tower.",
      difficulty: "easy"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: "Mars",
      hint: "Named after the Roman god of war, this planet appears reddish due to iron oxide.",
      difficulty: "easy"
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correct: "4",
      hint: "The most basic addition problem in mathematics.",
      difficulty: "easy"
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
      correct: "Da Vinci",
      hint: "This Renaissance artist was also an inventor and scientist.",
      difficulty: "medium"
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correct: "Pacific",
      hint: "This ocean covers about one-third of Earth's surface.",
      difficulty: "medium"
    },
    {
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correct: "Au",
      hint: "From the Latin word 'aurum' meaning 'shining dawn'.",
      difficulty: "hard"
    },
    {
      question: "Which country has the most time zones?",
      options: ["Russia", "USA", "China", "France"],
      correct: "France",
      hint: "This country has territories scattered across the globe.",
      difficulty: "hard"
    }
  ];

  const allAchievements = [
    { id: 'first_correct', name: 'First Success', description: 'Answer your first question correctly', icon: '🎯' },
    { id: 'streak_3', name: 'Hat Trick', description: 'Get 3 answers correct in a row', icon: '🔥' },
    { id: 'streak_5', name: 'On Fire', description: 'Get 5 answers correct in a row', icon: '🚀' },
    { id: 'power_user', name: 'Power User', description: 'Use all three types of power-ups', icon: '⚡' },
    { id: 'perfect_score', name: 'Perfectionist', description: 'Get 100% on a quiz', icon: '👑' },
    { id: 'speed_demon', name: 'Speed Demon', description: 'Answer a question in under 5 seconds', icon: '💨' },
    { id: 'hard_mode', name: 'Challenge Accepted', description: 'Complete a quiz on hard mode', icon: '💪' }
  ];

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  useEffect(() => {
    if (showAchievement) {
      const timer = setTimeout(() => setShowAchievement(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAchievement]);

  const playSound = (type) => {
    if (!soundEnabled) return;
    // In a real app, you'd play actual sound files here
    console.log(`Playing ${type} sound`);
  };

  const unlockAchievement = (achievementId) => {
    if (!achievements.includes(achievementId)) {
      const newAchievements = [...achievements, achievementId];
      setAchievements(newAchievements);
      const achievement = allAchievements.find(a => a.id === achievementId);
      setShowAchievement(achievement);
      playSound('achievement');
    }
  };

  const startQuiz = () => {
    const difficultySettings = difficulties[difficulty];
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer('');
    setShowResult(false);
    setIsQuizCompleted(false);
    setTimeLeft(difficultySettings.time);
    setTimerActive(true);
    setSkippedQuestions([]);
    setStreak(0);
    setPoints(0);
    setMultiplier(1);
    setPowerUps({ fiftyFifty: 2, extraTime: 2, doublePoints: 2 });
    setUsedPowerUps({});
    setQuestionHistory([]);
    setShowHint(false);
  };

  const handleAnswerSelect = (answer) => {
    if (!showResult) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = () => {
  if (!selectedAnswer) return;

  const answerTime = difficulties[difficulty].time - timeLeft;
  setTimerActive(false);
  setShowResult(true);

  const isCorrect = selectedAnswer === questions[currentQuestion].correct;
  const questionData = {
    question: questions[currentQuestion].question,
    selectedAnswer,
    correctAnswer: questions[currentQuestion].correct,
    isCorrect,
    timeSpent: answerTime
  };

  setQuestionHistory([...questionHistory, questionData]);

  if (isCorrect) {
    const newScore = score + 1;
    setScore(newScore);

    const newStreak = streak + 1;
    setStreak(newStreak);
    setMaxStreak(Math.max(maxStreak, newStreak));

    // Calculate points with multiplier and speed bonus
    let earnedPoints = 100 * multiplier * difficulties[difficulty].pointMultiplier;
    if (answerTime <= 5) earnedPoints *= 1.5; // Speed bonus
    setPoints(points + Math.round(earnedPoints));

    playSound('correct');

    // Check achievements
    if (newScore === 1) unlockAchievement('first_correct');
    if (newStreak === 3) unlockAchievement('streak_3');
    if (newStreak === 5) unlockAchievement('streak_5');
    if (answerTime <= 5) unlockAchievement('speed_demon');
  } else {
    setStreak(0);
    playSound('incorrect');
  }

  // Reset multiplier if it was from double points power-up
  if (usedPowerUps[currentQuestion]?.includes('doublePoints')) {
    setMultiplier(1);
  }

  // 🔁 Auto move to next question after 2 seconds
  setTimeout(() => {
    handleNextQuestion();
  }, 500);
};

const handleTimeUp = () => {
  if (!showResult) {
    setTimerActive(false);
    setShowResult(true);
    setStreak(0);
    setQuestionHistory([
      ...questionHistory,
      {
        question: questions[currentQuestion].question,
        selectedAnswer: 'Time Up',
        correctAnswer: questions[currentQuestion].correct,
        isCorrect: false,
        timeSpent: difficulties[difficulty].time
      }
    ]);
    playSound('timeup');

    // 🔁 Go to next question after time up (optional)
    setTimeout(() => {
      handleNextQuestion();
    }, 1000);
  }
};

const useFiftyFifty = () => {
  if (powerUps.fiftyFifty > 0 && !showResult) {
    const currentQ = questions[currentQuestion];
    const incorrectOptions = currentQ.options.filter(opt => opt !== currentQ.correct);
    const optionsToRemove = incorrectOptions.slice(0, 2);

    setPowerUps({ ...powerUps, fiftyFifty: powerUps.fiftyFifty - 1 });
    setUsedPowerUps({
      ...usedPowerUps,
      [currentQuestion]: [
        ...(usedPowerUps[currentQuestion] || []),
        'fiftyFifty',
        ...optionsToRemove
      ]
    });

    playSound('powerup');
  }
};

const useExtraTime = () => {
  if (powerUps.extraTime > 0 && timerActive) {
    setTimeLeft(timeLeft + 15);
    setPowerUps({ ...powerUps, extraTime: powerUps.extraTime - 1 });
    setUsedPowerUps({
      ...usedPowerUps,
      [currentQuestion]: [
        ...(usedPowerUps[currentQuestion] || []),
        'extraTime'
      ]
    });
    playSound('powerup');
  }
};

const useDoublePoints = () => {
  if (powerUps.doublePoints > 0 && !showResult) {
    setMultiplier(2);
    setPowerUps({ ...powerUps, doublePoints: powerUps.doublePoints - 1 });
    setUsedPowerUps({
      ...usedPowerUps,
      [currentQuestion]: [
        ...(usedPowerUps[currentQuestion] || []),
        'doublePoints'
      ]
    });
    playSound('powerup');
  }
};

const handleSkipQuestion = () => {
  setTimerActive(false);
  setSkippedQuestions([...skippedQuestions, currentQuestion]);
  setStreak(0);

  if (currentQuestion < questions.length - 1) {
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer('');
    setShowResult(false);
    setTimeLeft(difficulties[difficulty].time);
    setTimerActive(true);
    setShowHint(false);
  } else {
    completeQuiz();
  }
};

const handleNextQuestion = () => {
  const nextIndex = currentQuestion + 1;

  if (nextIndex < questions.length) {
    setCurrentQuestion(nextIndex);
    setSelectedAnswer('');
    setShowResult(false);
    setTimeLeft(difficulties[difficulty].time);
    setTimerActive(true);
    setShowHint(false);
  } else {
    completeQuiz();
  }
};

const completeQuiz = () => {
  setIsQuizCompleted(true);
  setTimerActive(false);

  // Check final achievements
  if (score === questions.length) unlockAchievement('perfect_score');
  if (difficulty === 'hard') unlockAchievement('hard_mode');

  const usedAllPowerUps =
    Object.values(usedPowerUps).flat().includes('fiftyFifty') &&
    Object.values(usedPowerUps).flat().includes('extraTime') &&
    Object.values(usedPowerUps).flat().includes('doublePoints');
  if (usedAllPowerUps) unlockAchievement('power_user');
};


  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return 'Perfect! 🏆';
    if (percentage >= 80) return 'Excellent! 🌟';
    if (percentage >= 60) return 'Good job! 👍';
    return 'Keep practicing! 💪';
  };

  const isOptionHidden = (option) => {
    const questionPowerUps = usedPowerUps[currentQuestion];
    return questionPowerUps && questionPowerUps.includes(option);
  };

  // Start screen
  if (!timerActive && currentQuestion === 0 && !isQuizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
          {/* Achievement notification */}
          {showAchievement && (
            <div className="fixed top-4 right-4 bg-yellow-400 text-yellow-900 px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{showAchievement.icon}</span>
                <div>
                  <div className="font-bold">{showAchievement.name}</div>
                  <div className="text-sm">{showAchievement.description}</div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Trophy className="w-20 h-20 text-yellow-500" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Ultimate Quiz Challenge
            </h1>
            <p className="text-gray-600">Test your knowledge and earn achievements!</p>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 text-center">Choose Difficulty</h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(difficulties).map(([key, diff]) => (
                <button
                  key={key}
                  onClick={() => setDifficulty(key)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    difficulty === key
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div>{diff.name}</div>
                  <div className="text-xs opacity-75">{diff.time}s • {diff.pointMultiplier}x pts</div>
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Game Features
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                Power-ups
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold">🔥</span>
                Streak System
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-500" />
                Point System
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500" />
                Achievements
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-600">Sound Effects</span>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                soundEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={startQuiz}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition duration-200 transform hover:scale-105 shadow-lg"
          >
            Start Quiz Adventure
          </button>
        </div>
      </div>
    );
  }

  // Results screen
  if (isQuizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <Trophy className="w-20 h-20 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
            <div className={`text-2xl font-bold mb-4 ${getScoreColor()}`}>
              {getScoreMessage()}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">{score}</div>
              <div className="text-sm text-green-600">Correct</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">{points}</div>
              <div className="text-sm text-blue-600">Points</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl text-center">
              <span className="text-2xl">🔥</span>
              <div className="text-2xl font-bold text-red-800">{maxStreak}</div>
              <div className="text-sm text-red-600">Best Streak</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-800">{achievements.length}</div>
              <div className="text-sm text-purple-600">Achievements</div>
            </div>
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Achievements Unlocked
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {achievements.map(achievementId => {
                  const achievement = allAchievements.find(a => a.id === achievementId);
                  return (
                    <div key={achievementId} className="bg-yellow-50 p-3 rounded-lg text-center">
                      <div className="text-2xl mb-1">{achievement.icon}</div>
                      <div className="text-xs font-semibold text-yellow-800">{achievement.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={startQuiz}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      {/* Achievement notification */}
      {showAchievement && (
        <div className="fixed top-4 right-4 bg-yellow-400 text-yellow-900 px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{showAchievement.icon}</span>
            <div>
              <div className="font-bold">{showAchievement.name}</div>
              <div className="text-sm">{showAchievement.description}</div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold">🔥</span>
                <span className="font-semibold text-red-600">{streak}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-blue-600">{points}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                <span className={`font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-purple-600'}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Power-ups */}
          <div className="flex justify-center gap-2">
            <button
              onClick={useFiftyFifty}
              disabled={powerUps.fiftyFifty === 0 || showResult}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
            >
              <Zap className="w-3 h-3" />
              50/50 ({powerUps.fiftyFifty})
            </button>
            <button
              onClick={useExtraTime}
              disabled={powerUps.extraTime === 0 || !timerActive}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
            >
              <Clock className="w-3 h-3" />
              +15s ({powerUps.extraTime})
            </button>
            <button
              onClick={useDoublePoints}
              disabled={powerUps.doublePoints === 0 || showResult || multiplier > 1}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
            >
              <Star className="w-3 h-3" />
              2x ({powerUps.doublePoints})
            </button>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex-1">
                {questions[currentQuestion].question}
              </h2>
              {multiplier > 1 && (
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold ml-4">
                  {multiplier}x Points!
                </div>
              )}
            </div>

            {/* Hint */}
            <div className="mb-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showHint ? 'Hide Hint' : '💡 Show Hint'}
              </button>
              {showHint && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg text-blue-800 text-sm">
                  💡 {questions[currentQuestion].hint}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {questions[currentQuestion].options.map((option, index) => {
                if (isOptionHidden(option)) return null;

                let buttonClass = "p-4 text-left border-2 rounded-xl transition-all duration-200 ";
                
                if (showResult) {
                  if (option === questions[currentQuestion].correct) {
                    buttonClass += "border-green-500 bg-gradient-to-r from-green-50 to-green-100 text-green-800 shadow-lg";
                  } else if (option === selectedAnswer && option !== questions[currentQuestion].correct) {
                    buttonClass += "border-red-500 bg-gradient-to-r from-red-50 to-red-100 text-red-800 shadow-lg";
                  } else {
                    buttonClass += "border-gray-200 text-gray-600";
                  }
                } else {
                  if (selectedAnswer === option) {
                    buttonClass += "border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 shadow-lg transform scale-105";
                  } else {
                    buttonClass += "border-gray-200 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:shadow-md hover:transform hover:scale-102";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={buttonClass}
                    disabled={showResult}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showResult && option === questions[currentQuestion].correct && (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      )}
                      {showResult && option === selectedAnswer && option !== questions[currentQuestion].correct && (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            {!showResult ? (
              <>
                <button
                  onClick={handleSkipQuestion}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 flex items-center gap-2"
                >
                  <SkipForward className="w-4 h-4" />
                  Skip
                </button>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl transition duration-200"
                >
                  Submit Answer
                </button>
              </>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition duration-200"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;