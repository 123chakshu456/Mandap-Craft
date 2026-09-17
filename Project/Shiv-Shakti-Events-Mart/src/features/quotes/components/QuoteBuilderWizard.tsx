import { useState, useMemo, type FormEvent } from 'react';
import { quoteApi } from '../services/quoteApi';

export interface QuoteBuilderWizardProps {
  showToast: (msg: string) => void;
}

export default function QuoteBuilderWizard({ showToast }: QuoteBuilderWizardProps) {
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardScale, setWizardScale] = useState('premium');
  const [wizardVenue, setWizardVenue] = useState('banquet');
  const [wizardDrapes, setWizardDrapes] = useState('heavy');
  const [wizardEmail, setWizardEmail] = useState('');
  const [wizardCompleted, setWizardCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Dynamic Quote Price calculation
  const estimatedQuotePrice = useMemo(() => {
    let base = 60000;
    if (wizardScale === 'intimate') base = 40000;
    if (wizardScale === 'royal') base = 140000;

    let venueMultiplier = 1.0;
    if (wizardVenue === 'garden') venueMultiplier = 1.25;
    if (wizardVenue === 'beach') venueMultiplier = 1.4;
    if (wizardVenue === 'fort') venueMultiplier = 1.5;

    let drapeAddon = 0;
    if (wizardDrapes === 'heavy') drapeAddon = 35000;
    if (wizardDrapes === 'glass') drapeAddon = 70000;

    return Math.round(base * venueMultiplier + drapeAddon);
  }, [wizardScale, wizardVenue, wizardDrapes]);

  const handleWizardSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!wizardEmail || !wizardEmail.includes('@')) {
      showToast('Please enter a valid email address to receive your quote proposal.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await quoteApi.createQuote({
        email: wizardEmail,
        scale: wizardScale,
        venue: wizardVenue,
        drapes: wizardDrapes,
        estimated: estimatedQuotePrice,
      });
      setWizardCompleted(true);
      showToast(`🎯 Bespoke proposal registered for ${wizardEmail}!`);
    } catch (err: any) {
      const msg = err.message || 'Unable to record quote at this moment. Please check connection.';
      setSubmitError(msg);
      showToast(`❌ ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetWizard = () => {
    setWizardCompleted(false);
    setSubmitError(null);
    setWizardStep(1);
  };

  return (
    <section className="wizard">
      <div className="wizard-container">
        <div className="wizard-header">
          <span className="section-label">Instant Cost Estimator</span>
          <h2>Generate Your Bespoke Event Infrastructure Quote</h2>
          <p>
            Don't wait weeks for an event contractor to respond. Map your requirements and get instant itemized estimates transparently.
          </p>

          {/* Step Indicators */}
          <div className="steps">
            {[1, 2, 3].map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => setWizardStep(step)}
                className={`step-btn ${wizardStep === step ? 'active' : ''}`}
              >
                Step {step}: {step === 1 ? 'Scale & Guests' : step === 2 ? 'Venue Layout' : 'Drapes & Gear'}
              </button>
            ))}
          </div>
        </div>

        <div className="wizard-body">
          {!wizardCompleted ? (
            <form onSubmit={handleWizardSubmit} className="wizard-options">
              {wizardStep === 1 && (
                <div className="option-group">
                  <span className="option-label">1. Scale of your setup or gathering</span>
                  <div className="option-items">
                    {[
                      { id: 'intimate', name: 'Intimate (Up to 150 Guests)' },
                      { id: 'premium', name: 'Premium (200 - 600 Guests)' },
                      { id: 'royal', name: 'Royal Mega Event (800+ Guests)' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setWizardScale(item.id)}
                        className={`option-item ${wizardScale === item.id ? 'active' : ''}`}
                      >
                        {item.name} {wizardScale === item.id && <span className="check" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="option-group">
                  <span className="option-label">2. Venue type &amp; terrain</span>
                  <div className="option-items">
                    {[
                      { id: 'banquet', name: '🏛️ Indoor Banquet Hall' },
                      { id: 'garden', name: '🌳 Open Outdoor Lawn / Farmhouse' },
                      { id: 'beach', name: '🏖️ Coastal / Beachfront' },
                      { id: 'fort', name: '🏰 Heritage Palace / Fort' },
                      { id: 'residence', name: '🏡 Private Luxury Estate' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setWizardVenue(item.id)}
                        className={`option-item ${wizardVenue === item.id ? 'active' : ''}`}
                      >
                        {item.name} {wizardVenue === item.id && <span className="check" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="option-group">
                  <span className="option-label">3. Stage drapery &amp; lighting specifications</span>
                  <div className="option-items">
                    {[
                      { id: 'standard', name: 'Standard Georgette & Seasonal Blooms' },
                      { id: 'heavy', name: 'Heavy Velvet, Orchid Arches & Sharpie Beams' },
                      { id: 'glass', name: 'Custom Glass, Crystal Chandeliers & LED Stage' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setWizardDrapes(item.id)}
                        className={`option-item ${wizardDrapes === item.id ? 'active' : ''}`}
                      >
                        {item.name} {wizardDrapes === item.id && <span className="check" />}
                      </button>
                    ))}
                  </div>

                  <div style={{ marginTop: '24px' }}>
                    <span className="option-label">Send Quote Proposal To:</span>
                    <input
                      type="email"
                      required
                      placeholder="name@eventcraft.com"
                      className="email-input"
                      value={wizardEmail}
                      onChange={(e) => setWizardEmail(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="wizard-actions">
                {wizardStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setWizardStep((prev) => prev - 1)}
                    className="btn-submit"
                  >
                    Back
                  </button>
                )}

                {wizardStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep((prev) => prev + 1)}
                    className="btn-get-quote"
                  >
                    Next Step
                  </button>
                ) : (
                  <button type="submit" className="btn-get-quote" disabled={isSubmitting}>
                    {isSubmitting ? 'Calculating & Registering...' : 'Generate Estimate Proposal'}
                  </button>
                )}
              </div>
              {submitError && (
                <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', fontSize: '0.82rem', textAlign: 'center' }}>
                  {submitError}
                </div>
              )}
            </form>
          ) : (
            <div className="quote-success">
              <div className="success-icon">
                <span className="icon">✓</span>
              </div>
              <div>
                <span className="success-label">Quote Generated</span>
                <h3>Estimate Proposal Finalized</h3>
              </div>
              <div className="quote-amount">
                ₹{estimatedQuotePrice.toLocaleString()}
              </div>
              <div className="quote-details">
                A comprehensive itemized quote and 3D floorplan proposal has been dispatched to{' '}
                <strong>{wizardEmail}</strong>. Our logistics manager will connect with you within 2 hours.
              </div>
              <button onClick={resetWizard} className="continue-btn">
                Recalculate Another Estimate
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
