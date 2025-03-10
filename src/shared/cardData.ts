import { BlackCard, WhiteCard } from './types';
import { v4 as uuidv4 } from 'uuid';

// Black cards (questions)
export const blackCards: BlackCard[] = [
  { id: uuidv4(), text: "Why can't I sleep at night?", pick: 1 },
  { id: uuidv4(), text: "What's that smell?", pick: 1 },
  { id: uuidv4(), text: "I got 99 problems but ____ ain't one.", pick: 1 },
  { id: uuidv4(), text: "Maybe she's born with it. Maybe it's ____.", pick: 1 },
  { id: uuidv4(), text: "What's the next Happy Meal© toy?", pick: 1 },
  { id: uuidv4(), text: "Anthropologists have recently discovered a primitive tribe that worships ____.", pick: 1 },
  { id: uuidv4(), text: "It's a pity that kids these days are all getting involved with ____.", pick: 1 },
  { id: uuidv4(), text: "During Picasso's often-overlooked Brown Period, he produced hundreds of paintings of ____.", pick: 1 },
  { id: uuidv4(), text: "Alternative medicine is now embracing the curative powers of ____.", pick: 1 },
  { id: uuidv4(), text: "And the Academy Award for ____ goes to ____.", pick: 2 },
  { id: uuidv4(), text: "What's that sound?", pick: 1 },
  { id: uuidv4(), text: "What ended my last relationship?", pick: 1 },
  { id: uuidv4(), text: "MTV's new reality show features eight washed-up celebrities living with ____.", pick: 1 },
  { id: uuidv4(), text: "I drink to forget ____.", pick: 1 },
  { id: uuidv4(), text: "I'm sorry professor, but I couldn't complete my homework because of ____.", pick: 1 },
  { id: uuidv4(), text: "What is Batman's guilty pleasure?", pick: 1 },
  { id: uuidv4(), text: "This is the way the world ends. Not with a bang but with ____.", pick: 1 },
  { id: uuidv4(), text: "What's a girl's best friend?", pick: 1 },
  { id: uuidv4(), text: "TSA guidelines now prohibit ____ on airplanes.", pick: 1 },
  { id: uuidv4(), text: "____. That's how I want to die.", pick: 1 },
  { id: uuidv4(), text: "For my next trick, I will pull ____ out of ____.", pick: 2 },
  { id: uuidv4(), text: "In the new Disney Channel Original Movie, Hannah Montana struggles with ____ for the first time.", pick: 1 },
  { id: uuidv4(), text: "____. It's a trap!", pick: 1 },
  { id: uuidv4(), text: "Coming to Broadway this season, ____: The Musical.", pick: 1 },
  { id: uuidv4(), text: "While the United States raced the Soviet Union to the moon, the Mexican government funneled millions of pesos into researching ____.", pick: 1 },
  { id: uuidv4(), text: "After the earthquake, Sean Penn brought ____ to the people of Haiti.", pick: 1 },
  { id: uuidv4(), text: "Next on ESPN2, the World Series of ____.", pick: 1 },
  { id: uuidv4(), text: "Step 1: ____. Step 2: ____. Step 3: Profit.", pick: 2 },
  { id: uuidv4(), text: "Rumor has it that Vladimir Putin's favorite dish is ____ stuffed with ____.", pick: 2 },
  { id: uuidv4(), text: "But before I kill you, Mr. Bond, I must show you ____.", pick: 1 },
  { id: uuidv4(), text: "What gives me uncontrollable gas?", pick: 1 },
  { id: uuidv4(), text: "What do old people smell like?", pick: 1 },
  { id: uuidv4(), text: "The class field trip was completely ruined by ____.", pick: 1 },
  { id: uuidv4(), text: "When Pharaoh remained unmoved, Moses called down a Plague of ____.", pick: 1 },
  { id: uuidv4(), text: "What's my secret power?", pick: 1 },
  { id: uuidv4(), text: "What's there a ton of in heaven?", pick: 1 },
  { id: uuidv4(), text: "What would grandma find disturbing, yet oddly charming?", pick: 1 },
  { id: uuidv4(), text: "I never truly understood ____ until I encountered ____.", pick: 2 },
  { id: uuidv4(), text: "What did the U.S. airdrop to the children of Afghanistan?", pick: 1 },
  { id: uuidv4(), text: "What helps Obama unwind?", pick: 1 },
  { id: uuidv4(), text: "What did Vin Diesel eat for dinner?", pick: 1 },
  { id: uuidv4(), text: "____: Good to the last drop.", pick: 1 },
  { id: uuidv4(), text: "What gets better with age?", pick: 1 },
  { id: uuidv4(), text: "____: kid-tested, mother-approved.", pick: 1 },
  { id: uuidv4(), text: "What's Teach for America using to inspire inner city students to succeed?", pick: 1 },
  { id: uuidv4(), text: "Studies show that lab rats navigate mazes 50% faster after being exposed to ____.", pick: 1 },
  { id: uuidv4(), text: "Life for American Indians was forever changed when the White Man introduced them to ____.", pick: 1 },
  { id: uuidv4(), text: "Make a haiku.", pick: 3 },
  { id: uuidv4(), text: "____ + ____ = ____.", pick: 3 },
  { id: uuidv4(), text: "What never fails to liven up the party?", pick: 1 },
  { id: uuidv4(), text: "What's the new fad diet?", pick: 1 },
  { id: uuidv4(), text: "Major League Baseball has banned ____ for giving players an unfair advantage.", pick: 1 },
];

// White cards (answers)
export const whiteCards: WhiteCard[] = [
  { id: uuidv4(), text: "Flying sex snakes." },
  { id: uuidv4(), text: "Michelle Obama's arms." },
  { id: uuidv4(), text: "German dungeon porn." },
  { id: uuidv4(), text: "White people." },
  { id: uuidv4(), text: "Getting so angry that you pop a boner." },
  { id: uuidv4(), text: "Tasteful sideboob." },
  { id: uuidv4(), text: "Praying the gay away." },
  { id: uuidv4(), text: "Two midgets shitting into a bucket." },
  { id: uuidv4(), text: "MechaHitler." },
  { id: uuidv4(), text: "Being a motherfucking sorcerer." },
  { id: uuidv4(), text: "A disappointing birthday party." },
  { id: uuidv4(), text: "Puppies!" },
  { id: uuidv4(), text: "A windmill full of corpses." },
  { id: uuidv4(), text: "Guys who don't call." },
  { id: uuidv4(), text: "Racially-biased SAT questions." },
  { id: uuidv4(), text: "Dying." },
  { id: uuidv4(), text: "Steven Hawking talking dirty." },
  { id: uuidv4(), text: "Being on fire." },
  { id: uuidv4(), text: "A lifetime of sadness." },
  { id: uuidv4(), text: "An erection that lasts longer than four hours." },
  { id: uuidv4(), text: "AIDS." },
  { id: uuidv4(), text: "Same-sex ice dancing." },
  { id: uuidv4(), text: "Glenn Beck catching his scrotum on a curtain hook." },
  { id: uuidv4(), text: "The Rapture." },
  { id: uuidv4(), text: "Pterodactyl eggs." },
  { id: uuidv4(), text: "Crippling debt." },
  { id: uuidv4(), text: "Eugenics." },
  { id: uuidv4(), text: "Exchanging pleasantries." },
  { id: uuidv4(), text: "My relationship status." },
  { id: uuidv4(), text: "Auschwitz." },
  { id: uuidv4(), text: "Civilian casualties." },
  { id: uuidv4(), text: "The homosexual agenda." },
  { id: uuidv4(), text: "The hardworking Mexican." },
  { id: uuidv4(), text: "A falcon with a cap on its head." },
  { id: uuidv4(), text: "Waiting 'til marriage." },
  { id: uuidv4(), text: "Natalie Portman." },
  { id: uuidv4(), text: "A micropig wearing a tiny raincoat and booties." },
  { id: uuidv4(), text: "Active listening." },
  { id: uuidv4(), text: "Ethnic cleansing." },
  { id: uuidv4(), text: "The Blood of Christ." },
  { id: uuidv4(), text: "My humps." },
  { id: uuidv4(), text: "Taking off your shirt." },
  { id: uuidv4(), text: "Hot people." },
  { id: uuidv4(), text: "Grandma." },
  { id: uuidv4(), text: "The miracle of childbirth." },
  { id: uuidv4(), text: "The Force." },
  { id: uuidv4(), text: "Breaking out into song and dance." },
  { id: uuidv4(), text: "Leprosy." },
  { id: uuidv4(), text: "Gloryholes." },
  { id: uuidv4(), text: "Nipple blades." },
  { id: uuidv4(), text: "The heart of a child." },
  { id: uuidv4(), text: "Puppies!" },
  { id: uuidv4(), text: "Fellowship in Christ." },
  { id: uuidv4(), text: "Prescription pain killers." },
  { id: uuidv4(), text: "Estrogen." },
  { id: uuidv4(), text: "Doin' it in the butt." },
  { id: uuidv4(), text: "Self-loathing." },
  { id: uuidv4(), text: "My bright future." },
  { id: uuidv4(), text: "Firing a rifle into the air while balls deep in a squealing hog." },
  { id: uuidv4(), text: "A time travel paradox." },
  { id: uuidv4(), text: "Poor people." },
  { id: uuidv4(), text: "Authentic Mexican cuisine." },
  { id: uuidv4(), text: "Sexual tension." },
  { id: uuidv4(), text: "Soup that is too hot." },
  { id: uuidv4(), text: "Morgan Freeman's voice." },
  { id: uuidv4(), text: "Breaking out into song and dance." },
  { id: uuidv4(), text: "Getting naked and watching Nickelodeon." },
  { id: uuidv4(), text: "Finger painting." },
  { id: uuidv4(), text: "Pretending to care." },
  { id: uuidv4(), text: "A sausage festival." },
  { id: uuidv4(), text: "Historical revisionism." },
  { id: uuidv4(), text: "Drinking alone." },
  { id: uuidv4(), text: "Fear itself." },
  { id: uuidv4(), text: "Lactation." },
  { id: uuidv4(), text: "Saving the whales." },
  { id: uuidv4(), text: "Dick pics." },
  { id: uuidv4(), text: "Extremely tight pants." },
  { id: uuidv4(), text: "The cool, refreshing taste of Pepsi®." },
];